import { useRouter } from 'next/router'
import { Plan, PricingFeature } from '@/types/Plan'
import EnhancedResponsivePricingCards from '@/components/hosting/EnhancedResponsivePricingCards'

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

  const mapped: Plan[] = plans.map((p) => {
    const price = parseFloat(p.originalPrice || '0') || 0
    const original = (price * 1.5).toFixed(2)
    const renewal = (price * 1.2).toFixed(2)
    const savePct = Math.max(0, Math.round((1 - price / parseFloat(original)) * 100))

    return {
      id: String(p.id),
      name: p.name,
      description: `Perfect for ${p.name.toLowerCase()} websites.`,
      category: p.category,
      billing_cycle: p.billing_cycle,
      originalPrice: original,
      currentPrice: price.toFixed(2),
      savePercentage: `Save ${savePct}%`,
      term: p.billing_cycle === 'yearly' ? 'For 12-month term' : 'For monthly term',
      renewalPrice: renewal,
      features: (p.features || []).map((feature): PricingFeature => {
        // Handle different input types
        if (typeof feature === 'string') {
          return {
            text: feature,
            included: true,
          };
        }

        // If it's already a PricingFeature object
        if (typeof feature === 'object' && feature.text) {
          return {
            text: feature.text,
            included: true,
            bold: feature.bold,
            underlined: feature.underlined,
          };
        }

        // Fallback for any other case
        return {
          text: String(feature),
          included: true,
        };
      }),
      isPopular: p.isPopular || false,
      buttonVariant: (p.isPopular || false) ? 'filled' : 'outline',
      buttonText: 'Get Started',
      onSelectPlan: () => router.push(`/login?plan_id=${p.id}`),
    };
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