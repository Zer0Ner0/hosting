import { useEffect, useMemo, useState, ReactNode } from "react";
import Link from "next/link";
import type { Plan as HostingPlan } from "@/types/Plan";
import Tooltip from "@/components/ui/Tooltip";

type Category = "web" | "wordpress" | "woocommerce" | "email";

type Props = {
  category: Category;
  title?: string;
  subtitle?: string;
  /** If provided, these features (exact strings) will be shown in this order. */
  features?: string[];
  /** If features are not provided, limit auto-picked features to this many. */
  maxFeatures?: number;
  /** Optional map of tooltips: key by feature label (case-insensitive). */
  featureTooltips?: Record<string, ReactNode | string>;
};

type ApiPlan = Partial<HostingPlan> & {
  id: number;
  name: string;
  price: number;
  billing_cycle?: "monthly" | "yearly" | string;
  category?: Category | string;
  features?: string[] | string | null;
};

const BILLING: Array<"monthly" | "yearly"> = ["monthly", "yearly"];

function normalizeFeature(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function CompareTable({
  category,
  title = "Compare plans",
  subtitle = "See what’s included at a glance.",
  features,
  maxFeatures = 10,
  featureTooltips, // ✅ make sure this is destructured
}: Props) {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";
        const res = await fetch(`${base}/api/plans/?category=${encodeURIComponent(category)}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Failed to fetch plans (${res.status})`);
        const data: ApiPlan[] = await res.json();
        if (!cancelled) setPlans(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Failed to load plans");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [category]);

  // Keep only plans matching current billing cycle, or those without a specified cycle.
  const plansForCycle = useMemo(() => {
    return plans
      .filter((p) => !p.billing_cycle || p.billing_cycle === billing)
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }, [plans, billing]);

  // Map plan -> feature set (normalized) & capture display labels.
  const planFeatureSets = useMemo(() => {
    return plansForCycle.map((p) => {
      const list =
        Array.isArray(p.features)
          ? p.features
          : typeof p.features === "string"
          ? p.features.split(/\r?\n|,|;|•/).map((s) => s.trim()).filter(Boolean)
          : [];
      const norm = new Set(list.map(normalizeFeature));
      return { id: p.id, raw: list, norm };
    });
  }, [plansForCycle]);

  // If features not provided, pick the most common ones across plans.
  const autoFeatures = useMemo(() => {
    const freq = new Map<string, { count: number; display: string }>();
    planFeatureSets.forEach(({ raw }) => {
      raw.forEach((label) => {
        const key = normalizeFeature(label);
        if (!key) return;
        const entry = freq.get(key);
        if (entry) {
          entry.count += 1;
        } else {
          // keep first-seen display casing
          freq.set(key, { count: 1, display: label.trim() });
        }
      });
    });
    const sorted = Array.from(freq.entries())
      .sort((a, b) => {
        const [, A] = a;
        const [, B] = b;
        if (B.count !== A.count) return B.count - A.count;
        return A.display.length - B.display.length;
      })
      .slice(0, maxFeatures)
      .map(([, v]) => v.display);
    return sorted;
  }, [planFeatureSets, maxFeatures]);

  const featureList = features && features.length > 0 ? features : autoFeatures;

  // ✅ Build tooltip lookup INSIDE the component, after props are destructured
  const tooltipMap = useMemo(() => {
    const m = new Map<string, ReactNode | string>();
    if (featureTooltips) {
      Object.entries(featureTooltips).forEach(([k, v]) => m.set(normalizeFeature(k), v));
    }
    return m;
  }, [featureTooltips]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {BILLING.map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                billing === b ? "bg-emerald-600 text-white shadow" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50",
              ].join(" ")}
              aria-pressed={billing === b}
            >
              {b === "monthly" ? "Monthly" : "Yearly"}
            </button>
          ))}
        </div>
      </header>

      {loading && (
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="mb-3 h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mb-3 h-5 w-56 animate-pulse rounded bg-gray-200" />
          <div className="h-64 animate-pulse rounded bg-gray-100" />
        </div>
      )}
      {!loading && error && <p className="text-center text-sm text-red-600">Failed to load plans: {error}</p>}

      {!loading && !error && plansForCycle.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-sm font-medium border-b">Feature</th>
                {plansForCycle.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-left text-sm font-medium border-b">
                    <div className="font-semibold">{p.name}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      {typeof p.price === "number"
                        ? p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : "-"}{" "}
                      / {p.billing_cycle ?? billing}
                    </div>
                    <Link
                      href={`/checkout?plan_id=${p.id}`}
                      className="mt-2 inline-flex rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                    >
                      Choose
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureList.map((label, idx) => {
                const key = normalizeFeature(label);
                const tip = tooltipMap.get(key);
                return (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    <th className="sticky left-0 z-[1] bg-inherit px-4 py-3 text-left text-sm font-medium border-b">
                      <span className="inline-flex items-center gap-2">
                        <span>{label}</span>
                        {tip ? (
                          <Tooltip content={tip}>
                            <button
                              type="button"
                              aria-label={`About ${label}`}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
                                <path d="M11 10h2v7h-2zM11 7h2v2h-2z" fill="currentColor" />
                              </svg>
                            </button>
                          </Tooltip>
                        ) : null}
                      </span>
                    </th>
                    {planFeatureSets.map(({ norm }, i) => (
                      <td key={i} className="px-4 py-3 text-center border-b">
                        {norm.has(key) ? (
                          <span aria-label="Included" title="Included" className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                            </svg>
                          </span>
                        ) : (
                          <span aria-label="Not included" title="Not included" className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-gray-500">* Features reflect the selected billing cycle where applicable.</p>
        </div>
      )}

      {!loading && !error && plansForCycle.length === 0 && (
        <p className="text-center text-sm text-gray-600">No plans available for this billing period yet.</p>
      )}
    </section>
  );
}
