// src/pages/hosting.tsx
import { useState } from 'react';

const tabData = [
  { key: 'web', label: 'Web Hosting' },
  { key: 'wordpress', label: 'WordPress Hosting' },
  { key: 'woocommerce', label: 'WooCommerce Hosting' },
  { key: 'email', label: 'Email Hosting' },
];

const plans = {
  web: [
    { name: 'Starter', price: 'RM9.99/mo', features: ['1 Website', '30 GB SSD', 'Free SSL'] },
    { name: 'Premium', price: 'RM19.99/mo', features: ['100 Websites', '100 GB SSD', 'Free Domain'] },
  ],
  wordpress: [
    { name: 'WP Basic', price: 'RM14.99/mo', features: ['1 Website', '50 GB SSD', 'Jetpack Free'] },
    { name: 'WP Pro', price: 'RM29.99/mo', features: ['Unlimited Sites', '200 GB SSD', 'Jetpack Premium'] },
  ],
  woocommerce: [
    { name: 'Store Launch', price: 'RM24.99/mo', features: ['WooCommerce Preinstalled', '100 GB SSD', 'Marketing Tools'] },
  ],
  email: [
    { name: 'Business Email', price: 'RM4.99/mo', features: ['5GB Storage', 'Webmail Access', 'Custom Domain Email'] },
  ],
};

export default function HostingPage() {
  const [activeTab, setActiveTab] = useState('web');

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Hosting</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        {tabData.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 mx-1 rounded-full text-sm font-medium border transition ${
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans[activeTab].map((plan, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-2xl text-blue-600 font-semibold mb-4">{plan.price}</p>
            <ul className="space-y-1 text-sm text-gray-700 mb-4">
              {plan.features.map((feat, i) => (
                <li key={i}>✔️ {feat}</li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
