'use client';
import React, { useEffect, useState } from 'react';
import { BlockData, defaultBlocks, RenderBlock, BlockType } from './blocks';

function uid() { return Math.random().toString(36).slice(2); }

export default function BuilderWizard() {
  const [step, setStep] = useState<number>(1);
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('builder.blocks');
    if (raw) setBlocks(JSON.parse(raw));
    else setBlocks(defaultBlocks.map(b => ({ ...b, id: b.id + '-' + uid() })));
  }, []);

  useEffect(() => {
    localStorage.setItem('builder.blocks', JSON.stringify(blocks));
  }, [blocks]);

  function addBlock(type: BlockType) {
    const presets: Record<BlockType, any> = {
      hero: { headline: 'Your Headline', sub: 'A short subtitle', cta: 'Call to Action' },
      features: { items: ['Feature one', 'Feature two', 'Feature three'] },
      pricing: { title: 'Pricing', price: 'RM0.00/mo', bullets: ['Item 1', 'Item 2'] },
      faq: { items: [{ q: 'Question?', a: 'Answer.' }] },
      footer: { text: '© ' + new Date().getFullYear() + ' Your Brand' }
    };
    setBlocks(prev => [...prev, { id: uid(), type, data: presets[type] }]);
  }

  function move(id: string, dir: -1 | 1) {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const copy = prev.slice();
      [copy[idx], copy[swap]] = [copy[swap], copy[idx]];
      return copy;
    });
  }

  function remove(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  function update(id: string, field: string, value: any) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, data: { ...b.data, [field]: value } } : b));
  }

  async function exportSite() {
    const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your Site</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  :root { --bg:#fff; --text:#111; --muted:#6b7280; --border:#e5e7eb; }
  * { box-sizing:border-box; }
  body { margin:0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans'; color:var(--text); background:var(--bg); }
  .container { max-width: 72rem; margin: 0 auto; padding: 0 1rem; }
  .btn { display:inline-flex; align-items:center; justify-content:center; padding:.5rem 1rem; border-radius:.75rem; border:1px solid var(--border); box-shadow:0 1px 2px rgba(0,0,0,.05); text-decoration:none; color:inherit; }
  .card { border:1px solid var(--border); border-radius:1rem; padding:1rem; box-shadow:0 1px 2px rgba(0,0,0,.05); background:#fff; }
  .text-center { text-align:center; }
  .py-12 { padding-top:3rem; padding-bottom:3rem; }
  .py-20 { padding-top:5rem; padding-bottom:5rem; }
  .mt-2 { margin-top:.5rem; } .mt-3 { margin-top:.75rem; } .mt-6 { margin-top:1.5rem; }
  .grid { display:grid; gap:1.5rem; } .md\:grid-cols-3 { grid-template-columns: repeat(1, minmax(0,1fr)); }
  @media (min-width:768px) { .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  .border-t { border-top:1px solid var(--border); }
  .prose p { line-height:1.7; color:#374151; }
</style>
<body>
  <div class="container">
    ${blocks.map(b => blockToHTML(b)).join("\n")}
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function blockToHTML(block: BlockData): string {
    switch (block.type) {
      case 'hero':
        return `<section class="py-20 text-center"><h1 class="text-4xl">${escapeHtml(block.data.headline||'')}</h1><p class="mt-3">${escapeHtml(block.data.sub||'')}</p><a class="btn mt-6" href="#">${escapeHtml(block.data.cta||'')}</a></section>`;
      case 'features':
        return `<section class="py-12"><h2 class="text-center">Features</h2><div class="grid md:grid-cols-3 mt-6">${(block.data.items||[]).map((it: string)=>`<div class="card text-center">${escapeHtml(it)}</div>`).join('')}</div></section>`;
      case 'pricing':
        return `<section class="py-12 text-center"><h2>${escapeHtml(block.data.title||'')}</h2><div class="card mt-6"><div class="text-4xl">${escapeHtml(block.data.price||'')}</div><ul class="mt-3">${(block.data.bullets||[]).map((b:string)=>`<li>• ${escapeHtml(b)}</li>`).join('')}</ul><a class="btn mt-6" href="#">Choose Plan</a></div></section>`;
      case 'faq':
        return `<section class="py-12"><h2 class="text-center">FAQ</h2>${(block.data.items||[]).map((f:any)=>`<details class="card"><summary>${escapeHtml(f.q||'')}</summary><p class="mt-2">${escapeHtml(f.a||'')}</p></details>`).join('')}</section>`;
      case 'footer':
        return `<footer class="py-12 text-center border-t">${escapeHtml(block.data.text||'')}</footer>`;
      default:
        return '';
    }
  }

  function escapeHtml(s: string) {
    return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c] as string));
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="card">
          <div className="text-sm text-gray-500">Step {step} of 3</div>
          <div className="mt-2 flex gap-2">
            {[1,2,3].map(s => (
              <button key={s} onClick={() => setStep(s)} className={`btn ${step===s ? 'bg-gray-900 text-white' : ''}`}> {s} </button>
            ))}
          </div>
        </div>

        {step === 1 && (
          <section className="card mt-6">
            <h3 className="font-semibold">Layout</h3>
            <p className="text-gray-600 mt-2">Add or arrange sections.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['hero','features','pricing','faq','footer'] as BlockType[]).map(t => (
                <button key={t} className="btn" onClick={() => addBlock(t)}>{t}</button>
              ))}
            </div>
            <ul className="mt-6 space-y-3">
              {blocks.map((b) => (
                <li key={b.id} className="border rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 border capitalize">{b.type}</span>
                  <div className="ml-auto flex gap-2">
                    <button className="btn" onClick={() => move(b.id, -1)}>Up</button>
                    <button className="btn" onClick={() => move(b.id, 1)}>Down</button>
                    <button className="btn" onClick={() => remove(b.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === 2 && (
          <section className="card mt-6">
            <h3 className="font-semibold">Customize</h3>
            <div className="mt-4 space-y-6">
              {blocks.map((b) => (
                <BlockEditor key={b.id} block={b} onChange={(field, value) => update(b.id, field, value)} />
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="card mt-6">
            <h3 className="font-semibold">Preview</h3>
            <div className="mt-4">
              {blocks.map((b) => <RenderBlock key={b.id} block={b} />)}
            </div>
            <button className="btn mt-6" onClick={exportSite}>Export HTML</button>
          </section>
        )}
      </div>

      <div>
        <div className="card">
          <h3 className="font-semibold">Tips</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-700 text-sm space-y-1">
            <li>Use short headlines.</li>
            <li>One primary CTA per page.</li>
            <li>Keep pricing simple.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BlockEditor({ block, onChange }: { block: BlockData, onChange: (field: string, value: any) => void }) {
  switch (block.type) {
    case 'hero':
      return (
        <div className="border rounded-xl p-3">
          <div className="font-semibold">Hero</div>
          <input className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={block.data.headline} onChange={e => onChange('headline', e.target.value)} placeholder="Headline" />
          <input className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={block.data.sub} onChange={e => onChange('sub', e.target.value)} placeholder="Subtitle" />
          <input className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={block.data.cta} onChange={e => onChange('cta', e.target.value)} placeholder="CTA text" />
        </div>
      );
    case 'features':
      return (
        <div className="border rounded-xl p-3">
          <div className="font-semibold">Features</div>
          {(block.data.items || []).map((it: string, i: number) => (
            <input key={i} className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={it}
              onChange={e => {
                const arr = [...(block.data.items || [])];
                arr[i] = e.target.value;
                onChange('items', arr);
              }} />
          ))}
          <button className="btn mt-2" onClick={() => onChange('items', [...(block.data.items || []), 'New feature'])}>Add Feature</button>
        </div>
      );
    case 'pricing':
      return (
        <div className="border rounded-xl p-3">
          <div className="font-semibold">Pricing</div>
          <input className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={block.data.title} onChange={e => onChange('title', e.target.value)} placeholder="Title" />
          <input className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={block.data.price} onChange={e => onChange('price', e.target.value)} placeholder="Price e.g. RM9.90/mo" />
          {(block.data.bullets || []).map((b: string, i: number) => (
            <input key={i} className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={b}
              onChange={e => {
                const arr = [...(block.data.bullets || [])];
                arr[i] = e.target.value;
                onChange('bullets', arr);
              }} />
          ))}
          <button className="btn mt-2" onClick={() => onChange('bullets', [...(block.data.bullets || []), 'New item'])}>Add Bullet</button>
        </div>
      );
    case 'faq':
      return (
        <div className="border rounded-xl p-3">
          <div className="font-semibold">FAQ</div>
          {(block.data.items || []).map((f: any, i: number) => (
            <div key={i} className="grid md:grid-cols-2 gap-2 mt-2">
              <input className="border rounded-xl px-3 py-2" defaultValue={f.q}
                onChange={e => {
                  const arr = [...(block.data.items || [])];
                  arr[i] = { ...arr[i], q: e.target.value };
                  onChange('items', arr);
                }} placeholder="Question" />
              <input className="border rounded-xl px-3 py-2" defaultValue={f.a}
                onChange={e => {
                  const arr = [...(block.data.items || [])];
                  arr[i] = { ...arr[i], a: e.target.value };
                  onChange('items', arr);
                }} placeholder="Answer" />
            </div>
          ))}
          <button className="btn mt-2" onClick={() => onChange('items', [...(block.data.items || []), { q: 'New question', a: 'Answer' }])}>Add Q&A</button>
        </div>
      );
    case 'footer':
      return (
        <div className="border rounded-xl p-3">
          <div className="font-semibold">Footer</div>
          <input className="w-full border rounded-xl px-3 py-2 mt-2" defaultValue={block.data.text} onChange={e => onChange('text', e.target.value)} placeholder="Footer text" />
        </div>
      );
    default:
      return null;
  }
}
