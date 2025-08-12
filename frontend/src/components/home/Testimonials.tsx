const testimonials = [
  { name: 'Ahmad Zulkifli', role: 'Small Business Owner, Johor', rating: 5,
    quote: 'Saya sangat puas hati dengan servis MyHosting. Mudah, cepat dan harga pun berpatutan!' },
  { name: 'Nurul Izzah', role: 'Freelance Web Designer, Penang', rating: 5,
    quote: 'Support 24 jam memang terbaik. Sangat sesuai untuk client saya yang perlukan hosting segera.' },
  { name: 'Jason Lim', role: 'eCommerce Founder, KL', rating: 4,
    quote: 'Saya suka interface yang senang guna. Domain & hosting semua settle dalam masa sejam!' },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Trusted by Hundreds of Malaysians</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-center mb-3 text-yellow-400">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
              <h4 className="font-semibold text-gray-900">{t.name}</h4>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}