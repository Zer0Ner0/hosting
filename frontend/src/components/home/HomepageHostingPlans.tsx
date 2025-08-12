'use client';
import { useEffect, useState } from 'react';
import HostingPlanList from '../hosting/HostingPlanList';
import { Plan } from '@/types/Plan';

export default function HomepageHostingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/plans/?category=web');
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(plan => plan.billing_cycle === billingCycle);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Popular Web Hosting Plans</h2>
        <div className="flex justify-center mb-8 gap-4">
          <button onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-full border transition ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>
            Monthly Billing
          </button>
          <button onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-full border transition ${billingCycle === 'yearly' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>
            Yearly Billing
          </button>
        </div>
        {loading ? (<p className="text-gray-500">Loading plans...</p>) : (<HostingPlanList plans={filteredPlans} />)}
      </div>
    </section>
  );
}