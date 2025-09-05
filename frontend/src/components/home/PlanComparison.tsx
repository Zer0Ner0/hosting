'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

type IconType = 'text' | 'check' | 'times';

type Spec = {
  label: string;
  value: string;
  icon: IconType;
  order: number;
};

type PlanWithSpecs = {
  id: number;
  name: string;
  specs: Spec[];
};

type PlanPrice = {
  id: number;
  name: string;
  price: string | number;
  billing_cycle: string;
  originalPrice?: string | number;
  savePercentage?: string;
};

type Category = 'web' | 'wordpress' | 'email' | 'woocommerce' | 'basic';

const CATEGORY_TITLES: Record<Category, string> = {
  web: 'Web Hosting',
  wordpress: 'WordPress Hosting',
  email: 'Email Hosting',
  woocommerce: 'WooCommerce Hosting',
  basic: 'Hosting',
};

/* ===== Icons ===== */
const CheckIcon = memo(function CheckIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="inline-block h-4 w-4">
      <path
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.6a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
        className="fill-[#166534]"
      />
    </svg>
  );
});

const CrossIcon = memo(function CrossIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="inline-block h-4 w-4">
      <path
        d="M14.7 5.3a1 1 0 0 1 0 1.4L11.4 10l3.3 3.3a1 1 0 1 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 1.4-1.4L10 8.6l3.3-3.3a1 1 0 0 1 1.4 0z"
        className="fill-neutral-400"
      />
    </svg>
  );
});

/* ===== Cells ===== */
const SpecCell = memo(function SpecCell({ spec }: { spec: Spec }): JSX.Element {
  if (spec.icon === 'check') return <CheckIcon />;
  if (spec.icon === 'times') return <CrossIcon />;
  return <span className="text-neutral-800">{spec.value}</span>;
});

/* ===== Utilities ===== */
function currency(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return String(amount);
  return `RM ${n.toFixed(2)}`;
}

function SrOnly({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="sr-only">{children}</span>;
}

function TableSkeleton(): JSX.Element {
  return (
    <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 ring-1 ring-gray-200">
      <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

/* ===== Component ===== */
export default function PlanComparison({
  category = 'web',
}: {
  category?: Category;
}): JSX.Element {
  const [plansWithSpecs, setPlansWithSpecs] = useState<PlanWithSpecs[]>([]);
  const [planPrices, setPlanPrices] = useState<PlanPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // cancel any in-flight fetch
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    // 1) Try sessionStorage cache first for instant paint
    if (typeof window !== 'undefined') {
      try {
        const cachedSpecs = sessionStorage.getItem(`preload:specs:${category}`);
        const cachedPrices = sessionStorage.getItem(`preload:prices:${category}`);
        if (cachedSpecs && cachedPrices) {
          const specData = JSON.parse(cachedSpecs) as PlanWithSpecs[];
          const priceData = JSON.parse(cachedPrices) as PlanPrice[];
          const order = specData.map((p) => p.id);
          const priceMap = new Map(priceData.map((p) => [p.id, p]));
          setPlansWithSpecs(specData);
          setPlanPrices(order.map((id) => priceMap.get(id)).filter(Boolean) as PlanPrice[]);
          setLoading(false);
        }
      } catch {
        /* ignore cache errors */
      }
    }

    // 2) Fetch fresh in background and refresh cache
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [specRes, priceRes] = await Promise.all([
          fetch(`${API_BASE}/api/plans/specs/?category=${category}`, { signal: ctrl.signal }),
          fetch(`${API_BASE}/api/plans/?category=${category}`, { signal: ctrl.signal }),
        ]);

        if (!specRes.ok || !priceRes.ok) {
          throw new Error(`Failed to load: specs ${specRes.status}, prices ${priceRes.status}`);
        }

        const [specData, priceData] = (await Promise.all([specRes.json(), priceRes.json()])) as [
          PlanWithSpecs[],
          PlanPrice[],
        ];

        if (ctrl.signal.aborted) return;

        const order = specData.map((p) => p.id);
        const priceMap = new Map(priceData.map((p) => [p.id, p]));
        setPlansWithSpecs(specData);
        setPlanPrices(order.map((id) => priceMap.get(id)).filter(Boolean) as PlanPrice[]);

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`preload:specs:${category}`, JSON.stringify(specData));
          sessionStorage.setItem(`preload:prices:${category}`, JSON.stringify(priceData));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load comparison specs/prices:', e);
        if ((e as any)?.name !== 'AbortError') {
          setError(e instanceof Error ? e.message : 'Failed to load comparison');
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => {
      ctrl.abort();
    };
  }, [API_BASE, category]);

  /* Build union of labels, sorted by min(order) */
  const labels = useMemo<string[]>(() => {
    const map = new Map<string, number>();
    plansWithSpecs.forEach((p) =>
      p.specs.forEach((s) => {
        map.set(s.label, Math.min(map.get(s.label) ?? s.order, s.order));
      }),
    );
    return [...map.entries()].sort((a, b) => a[1] - b[1]).map(([label]) => label);
  }, [plansWithSpecs]);

  const getSpec = (plan: PlanWithSpecs, label: string): Spec | undefined =>
    plan.specs.find((s) => s.label === label);

  /* Loading / empty */
  if (loading || !plansWithSpecs.length) {
    return (
      <section id={`${category}-comparison`} className="bg-white">
        <div className="w-full px-4 py-12 sm:px-6 lg:px-8" aria-live="polite">
          <p className="text-center text-neutral-500">Loading comparison…</p>
          <div className="mt-6">
            <TableSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={`${category}-comparison`} className="bg-white" aria-labelledby={`${category}-comparison-heading`}>
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <h2
          id={`${category}-comparison-heading`}
          className="text-center font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl"
        >
          Compare Our {CATEGORY_TITLES[category]} Packages
        </h2>

        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Table wrapper */}
        <div className="mt-8 overflow-x-auto">
          <div className="mx-auto max-w-7xl rounded-2xl bg-white ring-1 ring-gray-200">
            <table
              className="w-full min-w-[900px] table-fixed border-separate border-spacing-0"
              role="table"
              aria-label={`${CATEGORY_TITLES[category]} comparison table`}
            >
              <caption className="sr-only">Side-by-side hosting plan comparison</caption>

              {/* Equal column widths: left label column + N plan columns */}
              <colgroup>
                <col className="w-[260px]" />
                {plansWithSpecs.map((p) => (
                  <col key={p.id} className="w-[220px]" />
                ))}
              </colgroup>

              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-20 border-b border-r border-gray-200 bg-gray-50 px-6 py-4 text-center text-sm font-semibold text-gray-600"
                  >
                    <SrOnly>Specification</SrOnly>
                  </th>
                  {plansWithSpecs.map((p) => (
                    <th
                      scope="col"
                      key={p.id}
                      className="sticky top-0 z-10 border-b border-r border-gray-200 bg-gray-50 px-6 py-4 text-center text-sm font-semibold text-gray-800 last:border-r-0"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white">
                {labels.map((label, idx) => {
                  const isLast = idx === labels.length - 1;
                  return (
                    <tr key={label}>
                      <td
                        scope="row"
                        className={[
                          'sticky left-0 z-10 bg-white px-6 py-3 text-sm',
                          idx === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-700',
                          'border-r border-t border-gray-200',
                          isLast ? 'border-b' : '',
                        ].join(' ')}
                      >
                        {label}
                      </td>

                      {plansWithSpecs.map((p) => {
                        const spec = getSpec(p, label);
                        return (
                          <td
                            key={`${p.id}-${label}`}
                            className={[
                              'border-r border-t border-gray-200 px-6 py-3 text-sm',
                              isLast ? 'border-b' : '',
                            ].join(' ')}
                          >
                            <div className="text-center">
                              {spec ? <SpecCell spec={spec} /> : <span className="text-neutral-300">—</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>

              {/* Price + CTA (only for Web Hosting) */}
              {category === 'web' && (
                <tfoot>
                  <tr>
                    <td className="border-t border-r border-gray-200 px-6 py-6"></td>
                    {planPrices.map((plan) => (
                      <td key={plan.id} className="border-t border-r border-gray-200 px-4 py-6 last:border-r-0">
                        <div className="mx-auto w-full max-w-[220px] text-center">
                          {(plan.originalPrice || plan.savePercentage) && (
                            <div className="mb-2">
                              {plan.originalPrice && (
                                <span className="mr-2 text-sm text-neutral-500 line-through">
                                  {currency(plan.originalPrice)}
                                </span>
                              )}
                              {plan.savePercentage && (
                                <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#166534]">
                                  Save {plan.savePercentage}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Current price */}
                          <div className="mb-1">
                            <span className="font-heading text-3xl font-extrabold text-neutral-900">
                              {currency(plan.price)}
                            </span>
                            {/* Put "/mo" on its own line below the price for clarity & alignment */}
                            <div className="mt-0.5 text-sm text-neutral-500">/mo</div>
                          </div>

                          {/* CTA */}
                          <a
                            href={`/checkout?plan_id=${plan.id}`}
                            className="btn-primary mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold"
                            aria-label={`Order ${plan.name} at ${currency(plan.price)} per month`}
                          >
                            Order now
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
