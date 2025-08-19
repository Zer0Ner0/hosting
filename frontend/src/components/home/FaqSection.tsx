import { useState } from 'react';
const faqList = [
  { question: 'Berapa lama untuk aktifkan hosting saya?', answer: 'Hosting anda akan diaktifkan secara automatik dalam masa beberapa minit selepas pembayaran berjaya.' },
  { question: 'Adakah saya dapat domain percuma?', answer: 'Ya, untuk pelan terpilih seperti Premium & WordPress Pro, anda akan mendapat domain percuma untuk tahun pertama.' },
  { question: 'Boleh tak saya upgrade pelan hosting kemudian?', answer: 'Boleh. Anda boleh upgrade bila-bila masa tanpa gangguan kepada website anda.' },
  { question: 'Bagaimana kalau saya perlukan bantuan teknikal?', answer: 'Kami sediakan support 24/7 melalui live chat dan tiket sokongan.' },
];
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="space-y-4">
          {faqList.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-md overflow-hidden">
              <button onClick={() => toggle(i)} className="w-full text-left px-5 py-4 bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center">
                <span className="font-medium text-gray-800">{item.question}</span>
                <span className="text-xl">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <div className="px-5 py-4 text-gray-600 bg-white border-t border-gray-100">{item.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}