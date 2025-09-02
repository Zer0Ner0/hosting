'use client'
import React, { memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import type { PricingPlan, PricingFeature } from '@/types/Plan'
import EnhancedResponsivePricingCards from '@/components/hosting/EnhancedResponsivePricingCards'


interface Props {
  plans: PricingPlan[]
  title?: string
  subtitle?: string
  showFeatureLimit?: number
}

function HostingPlanList({
  plans,
  title = undefined,
  subtitle = undefined,
  showFeatureLimit = 15,
}: Props): React.ReactElement {
  const router = useRouter()

  if (!plans?.length) {
    return (
      <p role="status" className="text-center text-[#727586]">
        No plans available for this category.
      </p>
    )
  }

  const buildSelectHandler = useCallback(
    (id: PricingPlan['id']) => () => {
      router.push(`/login?plan_id=${id}`)
    },
    [router]
  )

  const mapFeature = (feature: string | PricingFeature): PricingFeature => {
    if (typeof feature === 'string') {
      return { text: feature, included: true }
    }
    if (typeof feature === 'object' && 'text' in feature && feature.text) {
      return {
        text: feature.text,
        included: feature.included ?? true,
        bold: feature.bold,
        underlined: feature.underlined,
      }
    }
    return { text: String(feature), included: true }
  }

  const mapped: PricingPlan[] = useMemo(() => {
    return plans.map((p) => {
      // Derive prices if not provided
      const current = Number.parseFloat(String(p.currentPrice ?? p.originalPrice ?? '0')) || 0
      const original = Number.parseFloat(String(p.originalPrice ?? current * 1.5)) || current * 1.5
      const renewal = Number.parseFloat(String(p.renewalPrice ?? current * 1.2)) || current * 1.2
      const savePct = Math.max(0, Math.round((1 - current / original) * 100))

      const features = (p.features ?? []).map(mapFeature)

      return {
        ...p,
        id: String(p.id),
        description: p.description ?? `Perfect for ${String(p.name).toLowerCase()} websites.`,
        originalPrice: original.toFixed(2),
        currentPrice: current.toFixed(2),
        savePercentage: p.savePercentage ?? `Save ${savePct}%`,
        term: p.term ?? 'For monthly term',
        renewalPrice: renewal.toFixed(2),
        features,
        isPopular: !!p.isPopular,
        buttonVariant: p.buttonVariant ?? (p.isPopular ? 'filled' : 'outline'),
        buttonText: p.buttonText ?? 'Get Started',
        onSelectPlan: p.onSelectPlan ?? buildSelectHandler(p.id),
      }
    })
  }, [buildSelectHandler, plans])

  return (
    <EnhancedResponsivePricingCards
      plans={mapped}
      title={title}
      subtitle={subtitle}
      showFeatureLimit={showFeatureLimit}
    />
  )
}

export default memo(HostingPlanList)