// src/pages/hosting.tsx
import { useEffect, useState } from 'react';

type Plan = {
  id: number;
  name: string;
  price: string;
  billing_cycle: string;
  category: string;
  is_popular: boolean;
  feature_list: string[];
};

const categories = [
  { key: 'web', label: 'Web Hosting' },
  { key: 'wordpress', label: 'WordPress Hosting' },
  { key: 'woocommerce', label: 'WooCommerce Hosting' },
  { key: 'email', label: 'Email Hosting' },
];

export default function HostingPage() {
  const [activeTab, setActiveTab] = useState('web');
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

  const filteredPlans = plans.filter(p => p.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Hosting</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {categories.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans */}
      {loading ? (
        <p className="text-center">Loading hosting plans...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 shadow hover:shadow-lg transition bg-white"
            >
              {plan.is_popular && (
                <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Popular</div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-2xl text-blue-600 font-semibold mb-4">
                RM{plan.price}/{plan.billing_cycle}
              </p>
              <ul className="space-y-1 text-sm text-gray-700 mb-4">
                {plan.feature_list.map((feat, i) => (
                  <li key={i}>✔️ {feat}</li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Get Started
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
