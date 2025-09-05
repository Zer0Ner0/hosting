// frontend/src/components/hosting/EnhancedResponsivePricingCards.tsx

'use client'

import React, { memo, useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import type {
  PricingPlan as Plan,
  PricingFeature,
  EnhancedResponsivePricingCardsProps,
} from '@/types/Plan'

/* ---------------- Icons (use currentColor) ---------------- */

const CheckIcon = memo(function CheckIcon(): React.ReactElement {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 17 13"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-emerald-700"
    >
      <path d="M16.498 12.176a.83.83 0 0 1-.29.687l-7.472 7.312-1.404 1.373a.83.83 0 0 1-1.082 0l-1.404-1.373-3.737-3.657a.83.83 0 0 1-.227-.687.83.83 0 0 1 .29-.686l1.404-1.373a.83.83 0 0 1 1.122.016l3.036 2.98 6.77-6.636a.83.83 0 0 1 1.19.005l1.404 1.373a.83.83 0 0 1 .181.665Z" />
    </svg>
  )
})

const MinusIcon = memo(function MinusIcon(): React.ReactElement {
  return (
    <div className="w-4 h-6 flex items-center justify-center" aria-hidden="true">
      <div className="w-4 h-px bg-neutral-500" />
    </div>
  )
})

const ArrowDownIcon = memo(function ArrowDownIcon(): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-emerald-800"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
})

/* ---------------- Feature Item ---------------- */

const FeatureItem = memo(function FeatureItem({
  feature,
}: {
  feature: PricingFeature
}): React.ReactElement {
  const renderText = (): React.ReactNode => {
    if (feature.bold) {
      const parts = feature.text.split(feature.bold)
      return (
        <>
          {parts[0]}
          <span className="font-bold">{feature.bold}</span>
          {parts[1]}
        </>
      )
    }
    return feature.text
  }

  return (
    <div className="flex items-start gap-3 min-h-[24px] py-1.5">
      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-1">
        {feature.included ? <CheckIcon /> : <MinusIcon />}
      </div>
      <div
        className={`text-sm leading-6 flex-1 ${
          feature.included ? 'text-neutral-900' : 'text-neutral-500'
        } ${feature.underlined ? 'underline underline-offset-2' : ''}`}
      >
        {renderText()}
      </div>
    </div>
  )
})

/* ---------------- Pricing Card ---------------- */

const PricingCard = memo(function PricingCard({
  plan,
  showFeatureLimit = 15,
  className = '',
  comparisonHref,
}: {
  plan: Plan
  showFeatureLimit?: number
  className?: string
  comparisonHref?: string
}): React.ReactElement {
  const [showAllFeatures, setShowAllFeatures] = useState<boolean>(false)

  const visibleFeatures = useMemo(
    () =>
      showAllFeatures ? plan.features : plan.features.slice(0, showFeatureLimit),
    [showAllFeatures, plan.features, showFeatureLimit],
  )

  const handleSelectPlan = useCallback((): void => {
    plan.onSelectPlan?.(plan.id)
  }, [plan])

  const panelId = useMemo(() => `features-${plan.id}`, [plan.id])

  return (
    <div className={`relative w-full h-full mx-auto ${className} text-center`}>
      {plan.isPopular && (
        <div className="absolute -top-[43px] left-0 right-0 h-10 bg-accent-gold border-2 border-accent-gold rounded-t-2xl flex items-center justify-center z-10">
          <span className="text-white text-sm font-bold uppercase tracking-wide leading-[14px]">
            Most popular
          </span>
        </div>
      )}

      <div
        className={`relative h-full rounded-2xl border-2 flex flex-col ${
          plan.isPopular
            ? 'border-accent-gold bg-neutral-50 rounded-t-none'
            : 'border-neutral-200 bg-white'
        } p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200 text-center`}
      >
        {/* Plan Name */}
        <div className="mb-2">
          <h3 className="font-heading text-xl font-bold text-neutral-900 leading-8">
            {plan.name}
          </h3>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="font-sans text-sm text-neutral-900 leading-6">
            {plan.description}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          {/* Original Price and Save Badge */}
          <div className="flex justify-center items-center gap-2 mb-4 text-center">
            <div className="flex items-center text-xs text-neutral-400 line-through font-sans">
              <span>RM</span>
              <span>{plan.originalPrice}</span>
            </div>
            <div className="bg-accent-mint rounded-full px-2 py-0.5">
              <span className="text-xs font-bold text-emerald-900 font-sans">
                {plan.savePercentage}
              </span>
            </div>
          </div>

          {/* Current Price */}
          <div className="mb-6 text-center">
            <div className="flex items-end justify-center gap-1">
              <span className="text-xl text-neutral-900 leading-none font-sans">
                RM
              </span>
              <span className="text-4xl md:text-5xl font-bold text-neutral-900 leading-none font-sans">
                {plan.currentPrice}
              </span>
              <span className="text-base md:text-lg text-neutral-900 leading-none ml-1 font-sans">
                /mo
              </span>
            </div>
            <p className="text-sm text-neutral-900/80 font-sans mt-2">
              {plan.term}
            </p>
          </div>

          {/* Renewal Price */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1 text-sm text-neutral-500 leading-6 font-sans">
              <span>RM</span>
              <span>{plan.renewalPrice}</span>
              <span>/mo</span>
              <span className="text-xs text-neutral-400">when you renew</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 mb-8" />

        {/* Features List */}
        <div
          id={panelId}
          className="space-y-0 mb-8 flex-1 text-left"
          aria-live="polite"
        >
          {visibleFeatures.map((feature, index) => (
            <FeatureItem key={`${feature.text}-${index}`} feature={feature} />
          ))}
        </div>

        {/* See All Features */}
        {plan.features.length > showFeatureLimit && (
          <button
            onClick={() => setShowAllFeatures((v) => !v)}
            className="mt-auto flex items-center gap-2 text-neutral-900 hover:text-emerald-700 transition-colors duration-200 font-sans"
            aria-expanded={showAllFeatures}
            aria-controls={panelId}
          >
            <span>
              {showAllFeatures ? 'Show less features' : 'See all features'}
            </span>
            <div
              className={`transform transition-transform duration-200 ${
                showAllFeatures ? 'rotate-180' : ''
              }`}
            >
              <ArrowDownIcon />
            </div>
          </button>
        )}

        {/* Choose Plan Button */}
        <div className="mb-2">
          <button
            onClick={handleSelectPlan}
            className={`w-full h-12 rounded-lg border-2 font-bold text-base transition-all duration-200 ${
              plan.buttonVariant === 'filled'
                ? 'btn-primary'
                : 'border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white'
            }`}
            aria-label={`Choose ${plan.name} at RM ${plan.currentPrice} per month`}
          >
            {plan.buttonText || 'Choose plan'}
          </button>
        </div>

        {/* See more features */}
        {comparisonHref && (
          <div className="mb-8">
            <Link
              href={comparisonHref}
              scroll={false}
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-emerald-900 hover:underline"
            >
              See more features
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="text-emerald-800"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
})

/* ---------------- Main Wrapper ---------------- */

const EnhancedResponsivePricingCards = memo(function EnhancedResponsivePricingCards({
  plans,
  title,
  subtitle,
  className = '',
  showFeatureLimit = 15,
  comparisonHref,
}: EnhancedResponsivePricingCardsProps & { comparisonHref?: string }): React.ReactElement {
  return (
    <div className={`bg-white py-8 lg:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-sans text-lg text-neutral-500 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <PricingCard
              key={String(plan.id ?? index)}
              plan={plan}
              showFeatureLimit={showFeatureLimit}
              comparisonHref={comparisonHref}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
})

export default EnhancedResponsivePricingCards
