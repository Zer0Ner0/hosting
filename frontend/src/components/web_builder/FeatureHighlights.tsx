// frontend/src/components/web_builder/FeatureHighlights.tsx
import { Check } from "lucide-react";

const FEATURES = [
  { title: "Drag & Drop Sections", desc: "Hero, features, gallery, FAQ and more." },
  { title: "Mobile-First", desc: "Looks great on phones, tablets, and desktops." },
  { title: "SEO & Analytics", desc: "Meta tags, sitemaps, and analytics hooks." },
  { title: "Fast Hosting", desc: "Global CDN, HTTP/2, SSL by default." },
  { title: "Custom Domains", desc: "Connect your .com.my or any Enom domain." },
  { title: "One-Click Publish", desc: "Ship changes instantly, safely." },
];

export default function FeatureHighlights() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Everything you need to launch
      </h2>
      <p className="mt-3 text-gray-600">
        Focus on content. We handle performance, security, and updates.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="rounded-2xl border p-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex rounded-full border p-1">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-medium">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
