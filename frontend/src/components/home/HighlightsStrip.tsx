import React from "react";

const items = [
  { title: "NVMe Storage", desc: "Superfast reads & writes for snappy sites." },
  { title: "LiteSpeed + LSCache", desc: "Next-gen web server with built-in caching." },
  { title: "Free SSL & Migrations", desc: "Secure by default; we’ll move you in." },
  { title: "24/7 Expert Support", desc: "Real humans when you need them." },
];

export default function HighlightsStrip() {
  return (
    <section aria-label="Key highlights" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-blue-800">{i.title}</p>
              <p className="mt-1 text-sm text-slate-600">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
