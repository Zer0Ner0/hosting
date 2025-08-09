import Link from 'next/link';
import { Plan } from '@/types/Plan';

export default function HostingPlanList({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) return <p className="text-center text-gray-500">No plans available for this category.</p>;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <div key={plan.id} className="border rounded-lg p-6 shadow hover:shadow-lg transition bg-white">
          {plan.is_popular && <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Popular</div>}
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-2xl text-blue-600 font-semibold mb-4">RM{plan.price}/{plan.billing_cycle}</p>
          <ul className="space-y-1 text-sm text-gray-700 mb-4">
            {plan.feature_list.map((feat, i) => (<li key={i}>✔️ {feat}</li>))}
          </ul>
          <Link href={`/login?plan_id=${plan.id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Get Started</Link>
        </div>
      ))}
    </div>
  );
}