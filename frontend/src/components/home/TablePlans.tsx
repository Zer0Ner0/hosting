//frontend/src/components/home/TablePlans.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import type { BackendPlanRaw, PricingPlan } from '@/types/Plan'
import EnhancedResponsivePricingCards from '../hosting/EnhancedResponsivePricingCards'

type FixedCat = 'web' | 'wordpress' | 'email' | 'woocommerce'
type Props = { fixedCategory?: FixedCat }

export default function TablePlans({ fixedCategory }: Props) {
  const router = useRouter()
  const [plans, setPlans] = useState<BackendPlanRaw[]>([])
  // Category tabs
  const categories = [
    { key: 'web', label: 'Web Hosting' },
    { key: 'wordpress', label: 'WordPress Hosting' },
    { key: 'email', label: 'Email Hosting' },
    { key: 'woocommerce', label: 'WooCommerce Hosting' },
  ] as const
  type CatKey = typeof categories[number]['key']
  const [category, setCategory] = useState<CatKey>('web')
  const [loading, setLoading] = useState(true)

  // Fetch whenever category changes
  useEffect(() => {
    let isMounted = true
    const fetchPlans = async () => {
      setLoading(true)
      try {
        const effectiveCategory = (fixedCategory ?? category)
        const res = await fetch(`http://localhost:8000/api/plans/?category=${effectiveCategory}`)
        const data = await res.json()
        if (isMounted) setPlans(data as BackendPlanRaw[])
      } catch (err) {
        console.error('Failed to fetch plans:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchPlans()
    return () => { isMounted = false }
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
        {!fixedCategory && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-wrap gap-2 rounded-full border-2 border-[#D5DFFF] p-1 bg-white">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${category === c.key ? 'bg-blue-900 text-white' : 'text-black hover:bg-[#F2F4FF]'
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-[#727586]">Loading plans...</p>
        ) : (
          <EnhancedResponsivePricingCards
            plans={mapped}
            showFeatureLimit={15}
          />
        )}
      </div>
    </section>
  )
}