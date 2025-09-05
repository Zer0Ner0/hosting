'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { BackendPlanRaw, PricingPlan } from '@/types/Plan';
import EnhancedResponsivePricingCards from '../hosting/EnhancedResponsivePricingCards';

/* ===========================
   Types
=========================== */
type CatKey = 'web' | 'wordpress' | 'email' | 'woocommerce';

interface Props {
  /** Lock the listing to a specific category (hides tabs when set) */
  fixedCategory?: CatKey;
}

interface TabsProps {
  active: CatKey;
  onChange: (key: CatKey) => void;
}

/* ===========================
   Utils
=========================== */
const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return 'Unknown error';
  }
};

const CATEGORIES: ReadonlyArray<{ key: CatKey; label: string }> = [
  { key: 'web',        label: 'Web Hosting' },
  { key: 'wordpress',  label: 'WordPress Hosting' },
  { key: 'email',      label: 'Email Hosting' },
  { key: 'woocommerce',label: 'WooCommerce Hosting' },
] as const;

/* ===========================
   Tabs (accessible)
=========================== */
const CategoryTabs = memo(function CategoryTabs({ active, onChange }: TabsProps): JSX.Element {
  return (
    <div className="mb-8 flex justify-center" role="tablist" aria-label="Hosting categories">
      <div className="inline-flex flex-wrap gap-2 rounded-full border-2 border-gray-200 bg-white p-1">
        {CATEGORIES.map((c) => {
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              id={`tab-${c.key}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${c.key}`}
              onClick={() => onChange(c.key)}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] focus-visible:ring-offset-white',
                isActive
                  ? 'bg-[#166534] text-white'
                  : 'text-neutral-700 hover:bg-neutral-100',
              ].join(' ')}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

/* ===========================
   Component
=========================== */
export default function TablePlans({ fixedCategory }: Props): JSX.Element {
  const router = useRouter();
  const [plans, setPlans] = useState<BackendPlanRaw[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CatKey>('web');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000';
  const effectiveCategory: CatKey = (fixedCategory ?? category) as CatKey;

  const handleCategory = useCallback((key: CatKey): void => {
    setCategory(key);
  }, []);

  /* 1) Hydrate from session cache for instant paint */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = sessionStorage.getItem(`preload:prices:${effectiveCategory}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as BackendPlanRaw[];
        setPlans(parsed);
        setLoading(false);
      } catch {
        // ignore bad cache
      }
    }
  }, [effectiveCategory]);

  /* 2) Fetch fresh data with abort + refresh cache */
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    (async () => {
      setError(null);
      setLoading((prev) => prev && plans.length === 0);

      try {
        const res = await fetch(`${API_BASE}/api/plans/?category=${effectiveCategory}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: BackendPlanRaw[] = await res.json();
        if (!alive) return;
        setPlans(json);

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`preload:prices:${effectiveCategory}`, JSON.stringify(json));
        }
      } catch (e: unknown) {
        if (controller.signal.aborted || !alive) return;
        // eslint-disable-next-line no-console
        console.error('Failed to load plans:', e);
        setError(getErrorMessage(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [API_BASE, effectiveCategory, plans.length]);

  /* Build comparison anchor for current category */
  const comparisonHref = useMemo<string>(() => {
    const map: Record<CatKey, string> = {
      web: '/hosting/web#web-comparison',
      wordpress: '/hosting/wordpress#wordpress-comparison',
      email: '/hosting/email#email-comparison',
      woocommerce: '/hosting/woocommerce#woocommerce-comparison',
    };
    return map[effectiveCategory];
  }, [effectiveCategory]);

  /* Map BackendPlan -> PricingPlan (UI) */
  const mapped: PricingPlan[] = useMemo<PricingPlan[]>(() => {
    const toPricingPlan = (p: BackendPlanRaw): PricingPlan => {
      const raw = (p.price ?? p.originalPrice ?? 0) as number | string;
      const priceNum = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
      const price = Number.isFinite(priceNum) ? priceNum : 0;

      // derive display numbers (kept simple)
      const original = (price * 1.5).toFixed(2);
      const renewal = (price * 1.2).toFixed(2);
      const savePct = Math.max(0, Math.round((1 - price / parseFloat(original)) * 100));

      // NOTE: Checkout flow is protected; route via /login first (existing behavior)
      return {
        id: String(p.id),
        name: p.name,
        description: `Perfect for ${p.name.toLowerCase()} websites.`,
        originalPrice: original,
        currentPrice: price.toFixed(2),
        savePercentage: `Save ${savePct}%`,
        term: p.billing_cycle === 'yearly' ? 'For 12-month term' : 'For monthly term',
        renewalPrice: renewal,
        features: (p.feature_list || []).map((text) => ({ text, included: true })),
        isPopular: Boolean(p.is_popular),
        buttonVariant: p.is_popular ? 'filled' : 'outline',
        buttonText: 'Get Started',
        onSelectPlan: (): void => router.push(`/login?plan_id=${p.id}`),
      };
    };

    return plans.map(toPricingPlan);
  }, [plans, router]);

  /* Render */
  return (
    <section className="bg-white py-8 font-sans text-neutral-900 lg:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Category Tabs (hidden when fixed) */}
        {!fixedCategory && (
          <CategoryTabs active={category} onChange={handleCategory} />
        )}

        {/* States */}
        {error && (
          <p role="alert" className="text-center text-sm text-red-600">
            Failed to load plans: {error}
          </p>
        )}

        {loading && plans.length === 0 && (
          <div
            aria-live="polite"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-gray-200 p-6"
                aria-label="Loading plan"
              >
                <div className="mb-4 h-5 w-2/3 rounded bg-gray-200" />
                <div className="mb-6 h-8 w-1/3 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-5/6 rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                </div>
                <div className="mt-6 h-10 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <p className="text-center text-sm text-neutral-500">No plans available.</p>
        )}

        {!loading && plans.length > 0 && (
          <div
            id={`panel-${effectiveCategory}`}
            role="tabpanel"
            aria-labelledby={`tab-${effectiveCategory}`}
            aria-live="polite"
          >
            <EnhancedResponsivePricingCards
              plans={mapped}
              showFeatureLimit={16}
              comparisonHref={comparisonHref}
            />
          </div>
        )}
      </div>
    </section>
  );
}
