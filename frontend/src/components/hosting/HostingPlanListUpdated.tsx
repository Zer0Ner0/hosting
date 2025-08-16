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
  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z" fill="currentColor" />
  </svg>
);

const MinusIcon = () => (
  <div className="w-4 h-1 bg-gray-300 rounded flex-shrink-0"></div>
);

const ArrowDownIcon = () => (
  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
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
    <div className="flex flex-col w-full max-w-sm mx-auto">
      {/* Popular Badge */}
      {isPopular && (
        <div className="flex justify-center items-center h-10 px-6 bg-blue-600 text-white text-sm font-semibold uppercase tracking-wider rounded-t-xl -mb-px z-10 relative">
          Most Popular
        </div>
      )}
      
      {/* Main Card */}
      <div className={`relative w-full ${
        isPopular 
          ? 'rounded-b-xl border-2 border-blue-600 bg-blue-50' 
          : 'rounded-xl border border-gray-200 bg-white'
      } shadow-md hover:shadow-lg transition-shadow duration-300`}>
        
        {/* Header Section */}
        <div className="p-6 pb-4">
          {/* Plan Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {plan.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {description}
          </p>

          {/* Pricing Row */}
          <div className="flex items-center gap-3 mb-4">
            {/* Original Price */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-sm line-through">RM{originalPrice}</span>
            </div>
            
            {/* Savings Badge */}
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              <span className="text-sm font-semibold">
                Save {savingsPercent}%
              </span>
            </div>
          </div>

          {/* Main Price */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-blue-600 text-lg">RM</span>
            <span className="text-blue-600 text-3xl font-bold">{plan.price}</span>
            <span className="text-blue-600 text-lg">/{plan.billing_cycle}</span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            For long-term commitment
          </p>

          {/* Months Free */}
          {plan.monthsFree && (
            <div className="mb-4">
              <span className="text-emerald-600 text-lg font-bold">
                {plan.monthsFree}
              </span>
            </div>
          )}

          {/* Renewal Price */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
            <span>RM{renewalPrice}/{plan.billing_cycle}</span>
            <span>when you renew</span>
          </div>

          {/* CTA Button */}
          <Link 
            href={`/login?plan_id=${plan.id}`}
            className={`block w-full text-center py-3 px-6 rounded-lg border-2 font-semibold text-base transition-all duration-200 ${
              isPopular
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
                : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700'
            }`}
          >
            Get Started
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-200 mb-6"></div>

        {/* Features Section */}
        <div className="px-6 pb-6">
          <div className="space-y-3 mb-6">
            {features.slice(0, 15).map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {feature.included ? <CheckIcon /> : <MinusIcon />}
                </div>
                <div className={`text-sm leading-relaxed ${
                  feature.included ? 'text-gray-700' : 'text-gray-400'
                } ${feature.underlined ? 'underline' : ''}`}>
                  {feature.bold && (
                    <span className="font-semibold">{feature.bold}</span>
                  )}
                  {feature.text}
                </div>
              </div>
            ))}
          </div>

          {/* See All Features */}
          <button className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
            See all features
            <ArrowDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HostingPlanListUpdated({ plans }: { plans: EnhancedPlan[] }) {
  if (plans.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No plans available for this category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
