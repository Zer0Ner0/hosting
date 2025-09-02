//frontend/src/components/home/TablePlans.tsx
'use client'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import type { BackendPlanRaw, PricingPlan } from '@/types/Plan'
import EnhancedResponsivePricingCards from '../hosting/EnhancedResponsivePricingCards'

type FixedCat = 'web' | 'wordpress' | 'email' | 'woocommerce'
interface Props {
  fixedCategory?: FixedCat
}

/** Small helper to keep error handling typed */
const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  try {
    return JSON.stringify(e)
  } catch {
    return 'Unknown error'
  }
}

type CatKey = 'web' | 'wordpress' | 'email' | 'woocommerce'
const categories = [
  { key: 'web' as const, label: 'Web Hosting' },
  { key: 'wordpress' as const, label: 'WordPress Hosting' },
  { key: 'email' as const, label: 'Email Hosting' },
  { key: 'woocommerce' as const, label: 'WooCommerce Hosting' },
] as const

interface TabsProps {
  active: CatKey
  onChange: (key: CatKey) => void
}
const CategoryTabs = memo(function CategoryTabs({ active, onChange }: TabsProps) {
  return (
    <div className="flex justify-center mb-8" role="tablist" aria-label="Hosting categories">
      <div className="inline-flex flex-wrap gap-2 rounded-full border-2 border-[#D5DFFF] p-1 bg-white">
        {categories.map((c) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={active === c.key}
            aria-controls={`panel-${c.key}`}
            onClick={() => onChange(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              active === c.key ? 'bg-blue-900 text-white' : 'text-black hover:bg-[#F2F4FF]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
})

export default function TablePlans({ fixedCategory }: Props): React.ReactElement {
  const router = useRouter()
  const [plans, setPlans] = useState<BackendPlanRaw[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000'

  const [category, setCategory] = useState<CatKey>('web')
  const handleCategory = useCallback((key: CatKey) => setCategory(key), [])

  // 1) Hydrate from cache immediately (no spinner if cached)
  useEffect(() => {
    const cat = (fixedCategory ?? category) as FixedCat
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(`preload:prices:${cat}`)
      if (cached) {
        try {
          setPlans(JSON.parse(cached))
          setLoading(false)
        } catch {}
      }
    }
  }, [category, fixedCategory])

  // 2) Fetch fresh data and refresh cache
  useEffect(() => {
    let alive = true
    const cat = (fixedCategory ?? category) as FixedCat
    const controller = new AbortController()
    ;(async () => {
      // only show spinner if nothing to show yet
      setLoading((prev) => prev && plans.length === 0)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/plans/?category=${cat}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: BackendPlanRaw[] = await res.json()
        if (!alive) return
        setPlans(json)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`preload:prices:${cat}`, JSON.stringify(json))
        }
      } catch (e: unknown) {
        if (controller.signal.aborted) return
        if (!alive) return
        console.error('Failed to load plans:', e)
        setError(getErrorMessage(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
      controller.abort()
    }
  }, [API_BASE, category, fixedCategory, plans.length])

  // Build comparison href based on the currently shown category
  const comparisonHref = useMemo(() => {
    const effectiveCategory = fixedCategory ?? category
    const comparisonHrefByCategory = {
      web: '/hosting/web#web-comparison',
      wordpress: '/hosting/wordpress#wordpress-comparison',
      email: '/hosting/email#email-comparison',
      woocommerce: '/hosting/woocommerce#woocommerce-comparison',
    } as const
    return comparisonHrefByCategory[effectiveCategory]
  }, [category, fixedCategory])

  // Map BackendPlan -> PricingPlan (UI)
  const mapped: PricingPlan[] = useMemo(() => {
    const toPricingPlan = (p: BackendPlanRaw): PricingPlan => {
      const raw = (p.price ?? p.originalPrice ?? 0) as number | string
      const priceNum = typeof raw === 'string' ? parseFloat(raw) : Number(raw)
      const price = Number.isFinite(priceNum) ? priceNum : 0
      const original = (price * 1.5).toFixed(2)
      const renewal = (price * 1.2).toFixed(2)
      const savePct = Math.max(0, Math.round((1 - price / parseFloat(original)) * 100))
      return {
        id: String(p.id),
        name: p.name,
        description: `Perfect for ${p.name.toLowerCase()} websites.`,
        originalPrice: original,
        currentPrice: price.toFixed(2),
        savePercentage: `Save ${savePct}%`,
        term: p.billing_cycle === 'yearly' ? 'For 12-month term' : 'For monthly term',
        renewalPrice: renewal,
        features: (p.feature_list || []).map(text => ({ text, included: true })), // ← use feature_list
        isPopular: !!p.is_popular,
        buttonVariant: p.is_popular ? 'filled' : 'outline',
        buttonText: 'Get Started',
        onSelectPlan: () => router.push(`/login?plan_id=${p.id}`),
      }
    }
    return plans.map(toPricingPlan)
  }, [plans, router])

  return (
    <section className="bg-white py-8 lg:py-12 font-['DM_Sans']">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Category Tabs (hidden if fixedCategory is provided) */}
        {!fixedCategory && <CategoryTabs active={category} onChange={handleCategory} />}

        {error && (
          <p role="alert" className="text-center text-red-600">
            Failed to load plans: {error}
          </p>
        )}
        {loading && plans.length === 0 && (
          <div aria-live="polite" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-gray-200 p-6"
                aria-label="Loading plan"
              >
                <div className="h-5 w-2/3 bg-gray-200 rounded mb-4" />
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-6" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded mt-6" />
              </div>
            ))}
          </div>
        )}
        {!loading && !error && plans.length === 0 && (
          <p className="text-center text-[#727586]">No plans available.</p>
        )}
        {!loading && plans.length > 0 && (
          <div id={`panel-${fixedCategory ?? category}`} role="tabpanel" aria-labelledby="">
            <EnhancedResponsivePricingCards
              plans={mapped}
              showFeatureLimit={15}
              comparisonHref={comparisonHref}
            />
          </div>
        )}
      </div>
    </section>
  )
}