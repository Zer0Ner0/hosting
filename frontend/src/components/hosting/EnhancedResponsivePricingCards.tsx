'use client'
import React, { memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import type { PricingPlan as Plan, PricingFeature, EnhancedResponsivePricingCardsProps } from "@/types/Plan";

const CheckIcon = memo(function CheckIcon(): React.ReactElement {
  return (
    <svg width="16" height="12" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_check)">
        <path d="M16.4984 12.1761C16.5004 12.3044 16.4758 12.4316 16.426 12.5498C16.3762 12.668 16.3023 12.7746 16.2091 12.8627L8.73653 20.1754L7.33267 21.5486C7.24093 21.6402 7.13168 21.7125 7.01143 21.761C6.89118 21.8096 6.7624 21.8334 6.63273 21.8312C6.50262 21.8339 6.3733 21.8102 6.25256 21.7617C6.13182 21.7131 6.02214 21.6406 5.93014 21.5486L4.52627 20.1754L0.789303 16.5184C0.696124 16.4302 0.622289 16.3237 0.572485 16.2055C0.522681 16.0873 0.497997 15.96 0.499998 15.8318C0.499998 15.5625 0.595989 15.3332 0.789303 15.1452L2.19317 13.772C2.28495 13.6799 2.39437 13.6073 2.51486 13.5585C2.63535 13.5097 2.76445 13.4857 2.89443 13.488C3.1704 13.488 3.40372 13.5827 3.59703 13.772L6.63273 16.7517L13.4027 10.1163C13.5894 9.92969 13.8427 9.82836 14.1053 9.8337C14.38 9.8337 14.6146 9.92702 14.8066 10.1163L16.2105 11.4895C16.3998 11.6682 16.5038 11.9175 16.4998 12.1775L16.4984 12.1761Z" fill="#00B090" />
      </g>
      <defs>
        <clipPath id="clip0_check">
          <rect width="16" height="11.9979" fill="white" transform="translate(0.5 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
});

const MinusIcon = memo(function MinusIcon(): React.ReactElement {
  return (
    <div className="w-4 h-6 flex items-center justify-center" aria-hidden="true">
      <div className="w-4 h-px bg-[#727586]" />
    </div>
  );
});

const ArrowDownIcon = memo(function ArrowDownIcon(): React.ReactElement {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 10L12 15L17 10" stroke="#673DE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

const FeatureItem = memo(function FeatureItem({ feature }: { feature: PricingFeature }): React.ReactElement {
  const renderText = (): React.ReactNode => {
    if (feature.bold) {
      const parts = feature.text.split(feature.bold);
      return (
        <>
          {parts[0]}
          <span className="font-bold">{feature.bold}</span>
          {parts[1]}
        </>
      );
    }
    return feature.text;
  };

  return (
    <div className="flex items-start gap-3 min-h-[24px] py-1.5">
      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-1">
        {feature.included ? <CheckIcon /> : <MinusIcon />}
      </div>
      <div className={`text-sm leading-6 flex-1 ${feature.included ? 'text-[#2F1C6A]' : 'text-[#727586]'
        } ${feature.underlined ? 'underline decoration-solid underline-offset-auto' : ''}`}>
        {renderText()}
      </div>
    </div>
  );
});

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
  const [showAllFeatures, setShowAllFeatures] = useState<boolean>(false);

  const visibleFeatures = useMemo(
    () => (showAllFeatures ? plan.features : plan.features.slice(0, showFeatureLimit)),
    [showAllFeatures, plan.features, showFeatureLimit]
  );

  const handleSelectPlan = useCallback((): void => {
    plan.onSelectPlan?.(plan.id);
  }, [plan]);

  const panelId = useMemo(() => `features-${plan.id}`, [plan.id]);

  return (
    <div className={`relative w-full h-full mx-auto ${className} text-center`}>
      {plan.isPopular && (
        <div className="absolute -top-[43px] left-0 right-0 h-10 bg-orange-500 border-2 border-orange-500 rounded-t-2xl flex items-center justify-center z-10">
          <span className="text-white text-sm font-bold uppercase tracking-wide leading-[14px]">Most popular</span>
        </div>
      )}

      <div className={`relative h-full rounded-2xl border-2 flex flex-col ${plan.isPopular
        ? 'border-orange-500 bg-[#FAFBFF] rounded-t-none'
        : 'border-[#D5DFFF] bg-white'
        } p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200 text-center`}>

        {/* Plan Name */}
        <div className="mb-2">
          <h3 className="text-xl font-bold text-[#000000] leading-8 font-['DM_Sans']">{plan.name}</h3>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm text-[#000000] leading-6 font-['DM_Sans']">{plan.description}</p>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          {/* Original Price and Save Badge */}
          <div className="flex justify-center items-center gap-2 mb-4 text-center">
            {/* Strikethrough Price */}
            <div className="flex items-center text-xs text-[#9CA3AF] line-through font-['DM_Sans']">
              <span>RM</span>
              <span>{plan.originalPrice}</span>
            </div>

            {/* Save Badge */}
            <div className="bg-[#D5DFFF] rounded-full px-2 py-0.5">
              <span className="text-xs font-bold text-blue-900 font-['DM_Sans']">
                {plan.savePercentage}
              </span>
            </div>
          </div>


          {/* Current Price */}
          <div className="mb-6 text-center">
            <div className="flex items-end justify-center gap-1">
              <span className="text-xl text-[#000000] leading-none font-['DM_Sans']">RM</span>
              <span className="text-4xl md:text-5xl font-bold text-[#000000] leading-none font-['DM_Sans']">
                {plan.currentPrice}
              </span>
              <span className="text-base md:text-lg text-[#000000] leading-none ml-1 font-['DM_Sans']">/mo</span>
            </div>
            <p className="text-sm text-[#000000] opacity-80 font-['DM_Sans'] mt-2">
              {plan.term}
            </p>
          </div>


          {/* Renewal Price */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1 text-sm text-[#727586] leading-6 font-['DM_Sans']">
              <span>RM</span>
              <span>{plan.renewalPrice}</span>
              <span>/mo</span>
              <span className="text-xs text-[#9CA3AF]">when you renew</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#D5DFFF] mb-8"></div>

        {/* Features List */}
        <div id={panelId} className="space-y-0 mb-8 flex-1 text-left" aria-live="polite">
          {visibleFeatures.map((feature, index) => (
            <FeatureItem key={`${feature.text}-${index}`} feature={feature} />
          ))}
        </div>

        {/* See All Features */}
        {plan.features.length > showFeatureLimit && (
          <button
            onClick={() => setShowAllFeatures((v) => !v)}
            className="mt-auto flex items-center gap-2 text-[#000000] hover:text-blue-800 transition-colors duration-200 font-['DM_Sans']"
            aria-expanded={showAllFeatures}
            aria-controls={panelId}
          >
            <span>{showAllFeatures ? 'Show less features' : 'See all features'}</span>
            <div className={`transform transition-transform duration-200 ${showAllFeatures ? 'rotate-180' : ''}`}>
              <ArrowDownIcon />
            </div>
          </button>
        )}

        {/* Choose Plan Button */}
        <div className="mb-2">
          <button
            onClick={handleSelectPlan}
            className={`w-full h-12 rounded-lg border-2 border-orange-400 font-bold text-base transition-all duration-200 font-['DM_Sans'] ${plan.buttonVariant === 'filled'
              ? 'bg-orange-400 text-white hover:bg-orange-600 hover:border-orange-600'
              : 'bg-transparent text-orange-500 hover:bg-orange-500 hover:text-white'
              }`}>
            <span className="sr-only">
              Choose {plan.name} at RM {plan.currentPrice} per month
            </span>
            <span aria-hidden="true">{plan.buttonText || 'Choose plan'}</span>
          </button>
        </div>

        {/* See more features (category-aware deep link) */}
        {comparisonHref && (
          <div className="mb-8">
            <Link
              href={comparisonHref}
              scroll={false}
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-blue-900 hover:underline"
            >
              See more features
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 10l5 5 5-5" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

const EnhancedResponsivePricingCards = memo(function EnhancedResponsivePricingCards({
  plans,
  title,
  subtitle,
  className = '',
  showFeatureLimit = 15,
  comparisonHref
}: EnhancedResponsivePricingCardsProps & { comparisonHref?: string }): React.ReactElement {
  return (
    <div className={`font-['DM_Sans'] bg-white py-8 lg:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4 font-['DM_Sans']">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-[#727586] max-w-3xl mx-auto font-['DM_Sans']">
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
  );
});

export default EnhancedResponsivePricingCards;
