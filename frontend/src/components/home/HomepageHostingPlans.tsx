//frontend/src/components/home/HomepageHostingPlans.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Plan } from '@/types/Plan'
import EnhancedResponsivePricingCards from '../hosting/EnhancedResponsivePricingCards'

// Backend shape (relaxed): features may be string[], string, or null
type ApiPlan = {
  id: number | string;
  name: string;
  price: number;
  billing_cycle?: 'monthly' | 'yearly' | string | null;
  isPopular?: boolean;
  is_popular?: boolean;
  features?: string[] | string | null;
};


export default function HomepageHostingPlans() {
  const router = useRouter()
  const [plans, setPlans] = useState<ApiPlan[]>([])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000').replace(/\/$/, '')
        const res = await fetch(`${base}/api/plans/?category=web`)
        const data: ApiPlan[] = await res.json()
        setPlans(data)
      } catch (err) {
        console.error('Failed to fetch plans:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const filteredPlans = useMemo(
    () => plans.filter((p) => !p.billing_cycle || p.billing_cycle === billingCycle),
    [plans, billingCycle]
  )

  const splitFeatures = (f: ApiPlan['features']): string[] => {
    if (Array.isArray(f)) return f.filter(Boolean).map(s => String(s).trim())
    if (typeof f === 'string') return f.split(/\r?\n|,|;|•/).map(s => s.trim()).filter(Boolean)
    return []
  }

  // Map backend Plan -> EnhancedResponsivePricingCards.PricingPlan
  const mapped: Plan[] = useMemo(() => {
    const toPricingPlan = (p: ApiPlan): Plan => {
      const price = Number(p.price) || 0
      const original = (price * 1.5).toFixed(2)
      const renewal = (price * 1.2).toFixed(2)
      const savePct = Math.max(0, Math.round((1 - price / parseFloat(original)) * 100))
      return {
        id: String(p.id ?? ''),
        name: p.name,
        description: `Perfect for ${p.name.toLowerCase()} websites.`,
        originalPrice: original,
        currentPrice: price.toFixed(2),
        savePercentage: `Save ${savePct}%`,
        term:
          p.billing_cycle === 'yearly'
            ? 'For 12-month term'
            : 'For monthly term',
        renewalPrice: renewal,
        features: splitFeatures(p.features).map(text => ({ text, included: true })),
        isPopular: Boolean(p.isPopular ?? p.is_popular),
        buttonVariant: (p.isPopular ?? p.is_popular) ? 'filled' : 'outline',
        buttonText: 'Get Started',
        onSelectPlan: () => router.push(`/login?plan_id=${p.id}`),
      }
    }
    return filteredPlans.map(toPricingPlan)
  }, [filteredPlans, router])

  return (
    <section className="bg-white py-8 lg:py-12 font-['DM_Sans']">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Billing toggle styled like the enhanced system */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border-2 border-[#D5DFFF] p-1 bg-white">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#673DE6] text-white'
                  : 'text-[#2F1C6A] hover:bg-[#F2F4FF]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-[#673DE6] text-white'
                  : 'text-[#2F1C6A] hover:bg-[#F2F4FF]'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-[#727586]">Loading plans...</p>
        ) : (
          <EnhancedResponsivePricingCards
            plans={mapped}
            title="Popular Web Hosting Plans"
            subtitle="Choose the perfect hosting plan for your website with our most popular options"
            showFeatureLimit={15}
          />
        )}
      </div>
    </section>
  )
}