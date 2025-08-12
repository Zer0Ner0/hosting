const plans = [
  { name: 'Starter', price: 'RM9.99/mo', features: ['1 Website','30 GB SSD','Free SSL','Weekly Backup'], highlighted: false },
  { name: 'Premium', price: 'RM19.99/mo', features: ['100 Websites','100 GB SSD','Free Domain','Daily Backup'], highlighted: true },
  { name: 'Business', price: 'RM29.99/mo', features: ['Unlimited Websites','200 GB SSD','Advanced Security','Priority Support'], highlighted: false },
];
export default function HostingPlanSelector() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Compare Hosting Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-lg p-6 border shadow-sm transition transform hover:scale-105 ${plan.highlighted ? 'border-blue-600 shadow-lg bg-white' : 'bg-white'}`}>
              {plan.highlighted && <div className="mb-3 text-sm font-semibold text-blue-600 uppercase">Popular</div>}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-2xl text-blue-600 font-semibold mb-4">{plan.price}</p>
              <ul className="text-sm text-gray-700 space-y-1 mb-6">{plan.features.map((f, idx) => (<li key={idx}>✔️ {f}</li>))}</ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}