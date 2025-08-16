import { useEffect, useMemo, useState, ReactNode } from "react";
import Link from "next/link";
import type { Plan as HostingPlan } from "@/types/Plan";
import NHCard from "./NHCard";


type Category = "web" | "wordpress" | "woocommerce" | "email";

type Props = {
  category: Category;
  heading?: string;
  subheading?: string;
  featureTooltips?: Record<string, ReactNode | string>;
  /** New: renders NameHero-like cards when "nh" */
  theme?: "default" | "nh";
  /** New: % off badge + strike-through (used by NH style) */
  promoSavePercent?: number;
};

type ApiPlan = Partial<HostingPlan> & {
  id: number;
  name: string;
  price: number;
  billing_cycle?: "monthly" | "yearly" | string;
  category?: Category | string;
  features?: string[] | string | null;
};

const billingCycles: Array<"monthly" | "yearly"> = ["monthly", "yearly"];
const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

function defaultTooltipFor(featureLabel: string): string | undefined {
  const l = featureLabel.toLowerCase();
  if (/\bstorage\b/.test(l)) return "Mailbox capacity per user. Bigger storage fits more mail and attachments.";
  if (/\baccounts?\b/.test(l)) return "Number of separate user mailboxes included (not aliases/forwarders).";
  return undefined;
}

export default function PlansSection({
  category, heading, subheading, featureTooltips, theme = "default", promoSavePercent,
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
    return () => { cancelled = true; };
  }, [category]);

  const filtered = useMemo(
    () =>
      plans
        .filter((p) => !p.billing_cycle || p.billing_cycle === billing)
        .sort((a, b) => (a.price ?? 0) - (b.price ?? 0)),
    [plans, billing]
  );

  // Build tooltip lookup ONLY after props are in scope
  const tooltipsMap = useMemo(() => {
    const m = new Map<string, ReactNode | string>();
    if (featureTooltips) {
      Object.entries(featureTooltips).forEach(([k, v]) => m.set(norm(k), v));
    }
    return m;
  }, [featureTooltips]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {(heading || subheading) && (
        <header className="mb-8 text-center">
          {heading && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>}
          {subheading && <p className="mt-2 text-muted-foreground">{subheading}</p>}
        </header>
      )}

      <div className="mb-6 flex items-center justify-center gap-2">
        {billingCycles.map((cycle) => (
          <button
            key={cycle}
            onClick={() => setBilling(cycle)}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              billing === cycle
                ? "bg-emerald-600 text-white shadow"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50",
            ].join(" ")}
            aria-pressed={billing === cycle}
          >
            {cycle === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

            {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plan) => {
            const features: string[] = Array.isArray(plan.features)
              ? plan.features
              : typeof plan.features === "string"
              ? plan.features.split(/\r?\n|,|;|•/).map((s) => s.trim()).filter(Boolean)
              : [];

            if (theme === "nh") {
              return (
                <NHCard
                  key={plan.id}
                  id={plan.id}
                  name={plan.name}
                  desc={
                    // tiny heuristic so your email plans show a short “ideal for …” if you set it later
                    (plan as any).description ?? undefined
                  }
                  price={plan.price ?? null}
                  cycle={plan.billing_cycle ?? billing}
                  features={features.slice(0, 9)}
                  checkoutHref={`/checkout?plan_id=${plan.id}`}
                  promoSavePercent={promoSavePercent}
                />
              );
            }

            // fallback to your existing default card
            return (
              <div key={plan.id} className="relative rounded-2xl border p-6 shadow-sm transition hover:shadow-md">
                {/* ...existing default card content (unchanged) */}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-bold leading-none">
                    {plan.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="pb-1 text-sm text-gray-500">/ {plan.billing_cycle ?? billing}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {features.slice(0, 8).map((f, i) => {
                    const tip = tooltipsMap.get(norm(f)) ?? defaultTooltipFor(f);
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                        <span className="inline-flex items-center gap-2">
                          <span>{f}</span>
                          {tip ? /* tooltip button */ null : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href={`/checkout?plan_id=${plan.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
