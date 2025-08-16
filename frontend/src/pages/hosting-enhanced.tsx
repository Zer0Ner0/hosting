import React from 'react';
import EnhancedResponsivePricingCards, { defaultPlans, type PricingPlan } from '../components/hosting/EnhancedResponsivePricingCards';

// Example of how to customize plans for different pages
const wordpressPlans: PricingPlan[] = [
  {
    id: "wordpress-starter",
    name: "WordPress Starter", 
    description: "Perfect for WordPress beginners.",
    originalPrice: "9.99",
    currentPrice: "1.99",
    savePercentage: "Save 80%",
    term: "For 48-month term",
    renewalPrice: "5.99",
    buttonVariant: "outline",
    buttonText: "Start with WordPress",
    features: [
      { text: "1 WordPress website", included: true, bold: "1" },
      { text: "~10 000 visits monthly", included: true, bold: "~10 000", underlined: true },
      { text: "50 GB SSD storage", included: true, bold: "50 GB" },
      { text: "WordPress pre-installed", included: true, bold: "WordPress pre-installed" },
      { text: "Free SSL certificate", included: true, bold: "Free", underlined: true },
      { text: "WordPress auto updates", included: true },
      { text: "Basic support", included: true },
      { text: "WordPress staging", included: false },
      { text: "Advanced caching", included: false },
      { text: "Priority support", included: false }
    ]
  },
  ...defaultPlans // Include the default plans
];

const emailPlans: PricingPlan[] = [
  {
    id: "email-professional",
    name: "Email Professional",
    description: "Professional email hosting for your business.",
    originalPrice: "4.99",
    currentPrice: "0.99",
    savePercentage: "Save 80%",
    term: "For 24-month term", 
    renewalPrice: "2.99",
    buttonVariant: "outline",
    buttonText: "Get Email Hosting",
    features: [
      { text: "10 email accounts", included: true, bold: "10" },
      { text: "25 GB storage per account", included: true, bold: "25 GB" },
      { text: "Custom domain email", included: true, bold: "Custom domain" },
      { text: "Webmail access", included: true },
      { text: "IMAP/POP3 support", included: true },
      { text: "Mobile app sync", included: true },
      { text: "Spam protection", included: true },
      { text: "24/7 email support", included: true }
    ]
  },
  {
    id: "email-business",
    name: "Email Business",
    description: "Advanced email features for growing teams.",
    originalPrice: "8.99",
    currentPrice: "2.99", 
    savePercentage: "Save 67%",
    term: "For 24-month term",
    renewalPrice: "5.99",
    isPopular: true,
    buttonVariant: "filled",
    buttonText: "Get Business Email",
    features: [
      { text: "50 email accounts", included: true, bold: "50" },
      { text: "50 GB storage per account", included: true, bold: "50 GB" },
      { text: "Custom domain email", included: true, bold: "Custom domain" },
      { text: "Webmail access", included: true },
      { text: "IMAP/POP3 support", included: true },
      { text: "Mobile app sync", included: true },
      { text: "Advanced spam protection", included: true, bold: "Advanced" },
      { text: "Calendar integration", included: true },
      { text: "File sharing", included: true },
      { text: "Priority support", included: true }
    ]
  }
];

const HostingEnhancedPage: React.FC = () => {
  const handlePlanSelection = (planId: string) => {
    console.log('Selected plan:', planId);
    // Add your plan selection logic here
    // e.g., redirect to checkout, update cart, etc.
  };

  // Add plan selection handler to plans
  const plansWithHandler = defaultPlans.map(plan => ({
    ...plan,
    onSelectPlan: handlePlanSelection
  }));

  const wordpressPlansWithHandler = wordpressPlans.map(plan => ({
    ...plan,
    onSelectPlan: handlePlanSelection
  }));

  const emailPlansWithHandler = emailPlans.map(plan => ({
    ...plan,
    onSelectPlan: handlePlanSelection
  }));

  return (
    <div className="min-h-screen bg-gray-50">
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
          plans={plansWithHandler}
          title="Web Hosting Plans"
          subtitle="Choose the perfect hosting plan for your website with our most popular options"
          className="mb-16"
        />
      </section>

      {/* WordPress Specific Plans */}
      <section className="bg-white py-16">
        <EnhancedResponsivePricingCards
          plans={wordpressPlansWithHandler}
          title="WordPress Hosting"
          subtitle="Optimized hosting solutions specifically designed for WordPress websites"
          showFeatureLimit={10}
        />
      </section>

      {/* Email Hosting Plans */}
      <section className="py-16">
        <EnhancedResponsivePricingCards
          plans={emailPlansWithHandler}
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
