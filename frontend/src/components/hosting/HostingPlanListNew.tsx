import Link from 'next/link';
import { Plan } from '@/types/Plan';

interface EnhancedPlan extends Plan {
  originalPrice?: string;
  savingsPercent?: number;
  renewalPrice?: string;
  monthsFree?: string;
  description?: string;
  enhancedFeatures?: Array<{
    text: string;
    bold?: string;
    underlined?: boolean;
    included: boolean;
  }>;
}

const CheckIcon = () => (
  <svg width="16" height="12" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <g clipPath="url(#clip0_1_424)">
      <path d="M16.4984 12.1761C16.5004 12.3044 16.4758 12.4316 16.426 12.5498C16.3762 12.668 16.3023 12.7746 16.2091 12.8627L8.73653 20.1754L7.33267 21.5486C7.24093 21.6402 7.13168 21.7125 7.01143 21.761C6.89118 21.8096 6.7624 21.8334 6.63273 21.8312C6.50262 21.8339 6.3733 21.8102 6.25256 21.7617C6.13182 21.7131 6.02214 21.6406 5.93014 21.5486L4.52627 20.1754L0.789303 16.5184C0.696124 16.4302 0.622289 16.3237 0.572485 16.2055C0.522681 16.0873 0.497997 15.96 0.499998 15.8318C0.499998 15.5625 0.595989 15.3332 0.789303 15.1452L2.19317 13.772C2.28495 13.6799 2.39437 13.6073 2.51486 13.5585C2.63535 13.5097 2.76445 13.4857 2.89443 13.488C3.1704 13.488 3.40372 13.5827 3.59703 13.772L6.63273 16.7517L13.4027 10.1163C13.5894 9.92969 13.8427 9.82836 14.1053 9.8337C14.38 9.8337 14.6146 9.92702 14.8066 10.1163L16.2105 11.4895C16.3998 11.6682 16.5038 11.9175 16.4998 12.1775L16.4984 12.1761Z" fill="#00B090"/>
    </g>
    <defs>
      <clipPath id="clip0_1_424">
        <rect width="16" height="11.9979" fill="white" transform="translate(0.5 0.5)"/>
      </clipPath>
    </defs>
  </svg>
);

const MinusIcon = () => (
  <div className="w-4 h-1 bg-gray-400 rounded"></div>
);

const ArrowDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 16L6 10H18L12 16Z" fill="currentColor"/>
  </svg>
);

function PlanCard({ plan }: { plan: EnhancedPlan }) {
  const isPopular = plan.is_popular;
  const originalPrice = plan.originalPrice || (parseFloat(plan.price) * 1.5).toFixed(2);
  const savingsPercent = plan.savingsPercent || Math.round((1 - parseFloat(plan.price) / parseFloat(originalPrice)) * 100);
  const renewalPrice = plan.renewalPrice || (parseFloat(plan.price) * 1.2).toFixed(2);
  const description = plan.description || `Perfect for ${plan.name.toLowerCase()} hosting needs.`;
  
  // Convert simple feature list to enhanced format if needed
  const features = plan.enhancedFeatures || plan.feature_list.map(feature => ({
    text: feature,
    included: true,
    underlined: false
  }));

  return (
    <div className="flex flex-col w-full max-w-[360px] mx-auto">
      {/* Popular Badge */}
      {isPopular && (
        <div className="flex w-full h-10 py-3 px-6 justify-center items-center rounded-t-2xl border-2 border-[#8C85FF] bg-[#8C85FF] -mb-px z-10 relative">
          <span className="text-white text-center font-bold text-sm uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}
      
      {/* Main Card */}
      <div className={`relative w-full ${
        isPopular 
          ? 'rounded-b-2xl border-2 border-[#8C85FF] bg-[#FAFBFF]' 
          : 'rounded-2xl border border-[#D5DFFF] bg-white'
      } shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        
        {/* Header Section */}
        <div className="p-8 pb-6">
          {/* Plan Name */}
          <h3 className="text-[#2F1C6A] text-xl font-bold mb-2">
            {plan.name}
          </h3>

          {/* Description */}
          <p className="text-[#2F1C6A] text-sm leading-6 mb-6">
            {description}
          </p>

          {/* Pricing Row */}
          <div className="flex items-center gap-3 mb-6">
            {/* Original Price */}
            <div className="flex items-center gap-1">
              <span className="text-[#727586] text-sm line-through">$</span>
              <span className="text-[#727586] text-sm line-through">{originalPrice}</span>
            </div>
            
            {/* Savings Badge */}
            <div className="px-3 py-1 rounded-full bg-[#D5DFFF]">
              <span className="text-[#2F1C6A] text-sm font-bold">
                Save {savingsPercent}%
              </span>
            </div>
          </div>

          {/* Main Price */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[#2F1C6A] text-xl">$</span>
            <span className="text-[#2F1C6A] text-5xl font-bold">{plan.price}</span>
            <span className="text-[#2F1C6A] text-xl">/mo</span>
          </div>
          
          <p className="text-[#2F1C6A] text-sm opacity-80 mb-4">
            For 48-month term
          </p>

          {/* Months Free */}
          {plan.monthsFree && (
            <div className="mb-6">
              <span className="text-[#673DE6] text-lg font-bold">
                {plan.monthsFree}
              </span>
            </div>
          )}

          {/* Renewal Price */}
          <div className="flex items-center gap-1 text-sm text-[#727586] mb-8">
            <span>$</span>
            <span>{renewalPrice}</span>
            <span>/mo</span>
            <span>when you renew</span>
          </div>

          {/* CTA Button */}
          <Link 
            href={`/login?plan_id=${plan.id}`}
            className={`block w-full text-center py-3 px-6 rounded-lg border-2 border-[#673DE6] font-bold text-base transition-colors duration-200 ${
              isPopular
                ? 'bg-[#673DE6] text-white hover:bg-[#5A33C3]'
                : 'bg-transparent text-[#673DE6] hover:bg-[#673DE6] hover:text-white'
            }`}
          >
            Choose plan
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-[#D5DFFF] mb-8"></div>

        {/* Features Section */}
        <div className="px-8 pb-8">
          <div className="space-y-3 mb-8">
            {features.slice(0, 15).map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1">
                  {feature.included ? <CheckIcon /> : <MinusIcon />}
                </div>
                <div className={`text-sm leading-6 ${
                  feature.included ? 'text-[#2F1C6A]' : 'text-[#727586]'
                } ${feature.underlined ? 'underline' : ''}`}>
                  {feature.bold && (
                    <span className="font-bold">{feature.bold}</span>
                  )}
                  {feature.text}
                </div>
              </div>
            ))}
          </div>

          {/* See All Features */}
          <button className="flex items-center gap-2 text-[#673DE6] font-bold text-base hover:underline">
            See all features
            <ArrowDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HostingPlanListNew({ plans }: { plans: EnhancedPlan[] }) {
  if (plans.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No plans available for this category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
