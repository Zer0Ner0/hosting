import React, { useEffect, useMemo, useState } from 'react';
import { Plan } from '@/types/Plan';
import EnhancedResponsivePricingCards from '@/components/hosting/EnhancedResponsivePricingCards';

// Example of how to customize plans for different pages

const HostingEnhancedPage: React.FC = () => {
  const [webPlans, setWebPlans] = useState<Plan[]>([]);
  const [wpPlans, setWpPlans] = useState<Plan[]>([]);
  const [mailPlans, setMailPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handlePlanSelection = (planId: string) => {
    console.log('Selected plan:', planId);
    // Add your plan selection logic here
    // e.g., redirect to checkout, update cart, etc.
  };

  // Fetch plans by category from backend
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000';
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [webRes, wpRes, mailRes] = await Promise.all([
          fetch(`${API_BASE}/api/plans/?category=web`, { credentials: 'include' }),
          fetch(`${API_BASE}/api/plans/?category=wordpress`, { credentials: 'include' }),
          fetch(`${API_BASE}/api/plans/?category=email`, { credentials: 'include' }),
        ]);
        if (!webRes.ok || !wpRes.ok || !mailRes.ok) {
          throw new Error('Failed to fetch one or more plan categories');
        }
        const [webJson, wpJson, mailJson] = await Promise.all([
          webRes.json(),
          wpRes.json(),
          mailRes.json(),
        ]);
        setWebPlans(webJson as Plan[]);
        setWpPlans(wpJson as Plan[]);
        setMailPlans(mailJson as Plan[]);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  // map backend Plan -> EnhancedResponsivePricingCards input
  const mapToPricing = (p: Plan) => {
    // NOTE: supports both array features and semicolon string "A;B;C"
    const featuresArray =
      Array.isArray((p as any).features)
        ? (p as any).features as string[]
        : typeof (p as any).features === 'string'
          ? ((p as any).features as string)
              .split(';')
              .map(s => s.trim())
              .filter(Boolean)
          : [];

    return {
      id: String((p as any).id ?? (p as any).pk ?? p.name),
      name: p.name,
      description: (p as any).description ?? '',
      originalPrice: (p as any).originalPrice ?? '',
      currentPrice: String(p.currentPrice),
      savePercentage: (p as any).savePercentage ?? '',
      term: (p as any).term ?? ((p as any).billing_cycle ?? 'Monthly'),
      renewalPrice: (p as any).renewalPrice ?? '',
      features: featuresArray.map(txt => ({ text: txt, included: true })),
      isPopular: Boolean((p as any).is_popular ?? (p as any).isPopular),
      buttonVariant: (p as any).buttonVariant ?? 'filled',
      buttonText: (p as any).buttonText ?? 'Select',
      onSelectPlan: handlePlanSelection,
    };
  };

  const plansWithHandler = useMemo(() => webPlans.map(mapToPricing), [webPlans]);
  const wordpressPlansWithHandler = useMemo(() => wpPlans.map(mapToPricing), [wpPlans]);
  const emailPlansWithHandler = useMemo(() => mailPlans.map(mapToPricing), [mailPlans]);

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2F1C6A] mb-6 font-['DM_Sans']">
            Enhanced Hosting Solutions
          </h1>
          <p className="text-xl text-[#727586] max-w-3xl mx-auto font-['DM_Sans']">
            Choose the perfect hosting plan for your needs with our enhanced responsive pricing cards
          </p>
        </div>
      </section>

      {/* Main Hosting Plans */}
      <section className="py-16">
        <EnhancedResponsivePricingCards
          plans={loading ? [] : plansWithHandler}
          title="Web Hosting Plans"
          subtitle="Choose the perfect hosting plan for your website with our most popular options"
          className="mb-16"
        />
      </section>

      {/* WordPress Specific Plans */}
      <section className="bg-white py-16">
        <EnhancedResponsivePricingCards
          plans={loading ? [] : wordpressPlansWithHandler}
          title="WordPress Hosting"
          subtitle="Optimized hosting solutions specifically designed for WordPress websites"
          showFeatureLimit={10}
        />
      </section>

      {/* Email Hosting Plans */}
      <section className="py-16">
        <EnhancedResponsivePricingCards
          plans={loading ? [] : emailPlansWithHandler}
          title="Email Hosting"
          subtitle="Professional email hosting solutions for your business"
          showFeatureLimit={8}
        />
      </section>

      {/* Feature Comparison Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2F1C6A] mb-4 font-['DM_Sans']">
              Why Choose Our Enhanced Hosting?
            </h2>
            <p className="text-lg text-[#727586] font-['DM_Sans']">
              Our enhanced responsive design ensures your pricing displays perfectly on any device
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#673DE6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2F1C6A] mb-2 font-['DM_Sans']">Responsive Design</h3>
              <p className="text-[#727586] font-['DM_Sans']">Perfect display on mobile, tablet, and desktop devices</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#673DE6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2F1C6A] mb-2 font-['DM_Sans']">Flexible Configuration</h3>
              <p className="text-[#727586] font-['DM_Sans']">Easily customize plans, features, and pricing for any page</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#673DE6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2F1C6A] mb-2 font-['DM_Sans']">Consistent Branding</h3>
              <p className="text-[#727586] font-['DM_Sans']">Unified design system across all hosting-related pages</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HostingEnhancedPage;
