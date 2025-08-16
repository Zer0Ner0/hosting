import { useRouter } from 'next/router'
import { Plan } from '@/types/Plan'
import EnhancedResponsivePricingCards, {
  type PricingPlan,
} from './EnhancedResponsivePricingCards'

type Props = {
  plans: Plan[]
  title?: string
  subtitle?: string
  showFeatureLimit?: number
}

export default function HostingPlanList({
  plans,
  title = undefined,
  subtitle = undefined,
  showFeatureLimit = 15,
}: Props) {
  const router = useRouter()

  if (!plans?.length) {
    return <p className="text-center text-[#727586]">No plans available for this category.</p>
  }

  const mapped: PricingPlan[] = plans.map((p) => {
    const price = parseFloat(p.price || '0') || 0
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
      term:
        p.billing_cycle === 'yearly'
          ? 'For 12-month term'
          : 'For monthly term',
      renewalPrice: renewal,
      features: (p.feature_list || []).map((text) => ({
        text,
        included: true,
      })),
      isPopular: p.is_popular,
      buttonVariant: p.is_popular ? 'filled' : 'outline',
      buttonText: 'Get Started',
      onSelectPlan: () => router.push(`/login?plan_id=${p.id}`),
    }
  })

  return (
    <EnhancedResponsivePricingCards
      plans={mapped}
      title={title}
      subtitle={subtitle}
      showFeatureLimit={showFeatureLimit}
    />
  )
}