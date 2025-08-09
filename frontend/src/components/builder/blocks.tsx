import React from 'react';

export type BlockType = 'hero' | 'features' | 'pricing' | 'faq' | 'footer';

export type BlockData = {
  id: string;
  type: BlockType;
  data: Record<string, any>;
};

export const defaultBlocks: BlockData[] = [
  { id: 'b-hero', type: 'hero', data: { headline: 'Build with AmirHost', sub: 'Launch a beautiful site in minutes.', cta: 'Get Started' } },
  { id: 'b-features', type: 'features', data: { items: ['Drag & drop', 'SEO-ready', 'Free SSL'] } },
  { id: 'b-pricing', type: 'pricing', data: { title: 'Simple Pricing', price: 'RM9.90/mo', bullets: ['1 website', '10 GB storage', 'Free SSL'] } },
  { id: 'b-faq', type: 'faq', data: { items: [{ q: 'Can I use my domain?', a: 'Yes, connect any domain.' }, { q: 'Is SSL included?', a: 'Yes, free SSL on all plans.' }] } },
  { id: 'b-footer', type: 'footer', data: { text: '© ' + new Date().getFullYear() + ' Your Brand' } },
];

export function RenderBlock({ block }: { block: BlockData }) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="py-20 text-center">
          <h1 className="text-4xl font-extrabold">{block.data.headline}</h1>
          <p className="mt-3 text-gray-600">{block.data.sub}</p>
          <a href="#" className="btn mt-6">{block.data.cta}</a>
        </section>
      );
    case 'features':
      return (
        <section className="py-12">
          <h2 className="text-2xl font-bold text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {block.data.items?.map((it: string, i: number) => (
              <div key={i} className="card text-center">{it}</div>
            ))}
          </div>
        </section>
      );
    case 'pricing':
      return (
        <section className="py-12">
          <h2 className="text-2xl font-bold text-center">{block.data.title}</h2>
          <div className="max-w-md mx-auto card mt-6 text-center">
            <div className="text-4xl font-extrabold">{block.data.price}</div>
            <ul className="mt-4 space-y-1 text-gray-700">
              {block.data.bullets?.map((b: string, i: number) => <li key={i}>• {b}</li>)}
            </ul>
            <a href="#" className="btn mt-6">Choose Plan</a>
          </div>
        </section>
      );
    case 'faq':
      return (
        <section className="py-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center">FAQ</h2>
          <div className="mt-6 space-y-3">
            {block.data.items?.map((f: any, i: number) => (
              <details key={i} className="card">
                <summary className="font-semibold cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-gray-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      );
    case 'footer':
      return (
        <footer className="py-12 text-center text-gray-500 border-t">
          {block.data.text}
        </footer>
      );
    default:
      return null;
  }
}
