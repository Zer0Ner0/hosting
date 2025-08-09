import { useEffect, useState } from 'react';
import HostingPlanList from '@/components/HostingPlanList';
import { Plan } from '@/types/Plan';

const categories = [
  { key: 'web', label: 'Web Hosting' },
  { key: 'wordpress', label: 'WordPress Hosting' },
  { key: 'woocommerce', label: 'WooCommerce Hosting' },
  { key: 'email', label: 'Email Hosting' },
];

export default function HostingPage() {
  const [activeTab, setActiveTab] = useState('web');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/plans/');
        const data = await res.json();
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch hosting plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(p => p.category === activeTab && p.billing_cycle === billingCycle);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Hosting</h1>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-6 gap-4">
        <button onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 rounded-full border transition ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>
          Monthly Billing
        </button>
        <button onClick={() => setBillingCycle('yearly')}
          className={`px-4 py-2 rounded-full border transition ${billingCycle === 'yearly' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>
          Yearly Billing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {categories.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeTab === tab.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans */}
      {loading ? <p className="text-center">Loading hosting plans...</p> : <HostingPlanList plans={filteredPlans} />}
    </div>
  );
}