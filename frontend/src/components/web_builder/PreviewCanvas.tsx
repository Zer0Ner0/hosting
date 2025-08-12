// frontend/src/components/web_builder/PreviewCanvas.tsx
"use client";

import type { SectionId, Template } from "@/types/Builder";
import FaqSection from "@/components/home/FaqSection";
import Link from "next/link";

interface Props {
  template: Template;
  enabled: Record<SectionId, boolean>;
  order: SectionId[];                  // <-- NEW
}

export default function PreviewCanvas({ template, enabled, order }: Props) {
  return (
    <div className="flex-1 rounded-2xl border overflow-hidden bg-white">
      {/* Canvas header */}
      <div className="flex items-center justify-between border-b px-4 md:px-6 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold truncate">{template.title}</h1>
          <p className="text-xs text-gray-500">Preview — {template.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/hosting?template=${encodeURIComponent(template.slug)}`}
            className="inline-flex items-center rounded-xl bg-indigo-600 px-3 py-2 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Use this template
          </Link>
          <Link
            href="/builder"
            className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Back to templates
          </Link>
        </div>
      </div>

      {/* Canvas content */}
      <div className="space-y-12">
        {order.map((sec) => {
          if (!enabled[sec]) return null;
          switch (sec) {
            case "hero":
              return (
                <HeroSection
                  key="hero"
                  title={template.title}
                  subtitle={template.description}
                />
              );
            case "features":
              return <FeaturesSection key="features" tags={template.tags} />;
            case "gallery":
              return <GallerySection key="gallery" />;
            case "pricing":
              return <PricingSection key="pricing" isFree={template.isFree} />;
            case "faq":
              return <FaqWrapper key="faq" />;
            case "cta":
              return <BottomCta key="cta" slug={template.slug} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

function HeroSection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-pink-50" />
      <div className="px-4 md:px-6 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
          <p className="mt-3 text-gray-600">{subtitle}</p>
          <div className="mt-6 flex gap-3">
            <a href="#pricing" className="rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-medium hover:bg-black">
              See pricing
            </a>
            <a href="#gallery" className="rounded-xl border px-5 py-3 text-sm font-medium hover:bg-gray-50">
              View gallery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ tags }: { tags: string[] }) {
  const items = [
    { title: "Customisable Sections", desc: "Toggle and reorder blocks easily." },
    { title: "Responsive by Default", desc: "Looks great on any device." },
    { title: "SEO-ready", desc: "Meta tags, sitemap, and clean markup." },
  ];
  return (
    <section className="px-4 md:px-6">
      <h3 className="text-xl md:text-2xl font-semibold">Why this template?</h3>
      <p className="mt-2 text-gray-600">Best for: {tags.slice(0, 3).join(", ")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i.title} className="rounded-2xl border p-5">
            <h4 className="font-medium">{i.title}</h4>
            <p className="mt-1 text-sm text-gray-600">{i.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GallerySection() {
  return (
    <section id="gallery" className="px-4 md:px-6">
      <h3 className="text-xl md:text-2xl font-semibold">Gallery</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[16/10] rounded-xl border bg-gradient-to-br from-gray-100 to-gray-200" />
        ))}
      </div>
    </section>
  );
}

function PricingSection({ isFree }: { isFree: boolean }) {
  const tiers = isFree
    ? [
      { name: "Starter", price: "RM0", features: ["Template access", "Basic sections"] },
      { name: "Pro", price: "RM19/mo", features: ["All sections", "Custom domain", "Analytics"] },
    ]
    : [
      { name: "Standard", price: "RM19/mo", features: ["Template license", "Core sections"] },
      { name: "Business", price: "RM39/mo", features: ["All sections", "Priority support", "Analytics"] },
    ];
  return (
    <section id="pricing" className="px-4 md:px-6">
      <h3 className="text-xl md:text-2xl font-semibold">Pricing</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl border p-5">
            <div className="flex items-baseline justify-between">
              <h4 className="font-medium">{t.name}</h4>
              <span className="text-lg font-semibold">{t.price}</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5">
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqWrapper() {
  return (
    <section className="px-4 md:px-6">
      {/* Reuse global FAQ component */}
      <FaqSection />
    </section>
  );
}

function BottomCta({ slug }: { slug: string }) {
  return (
    <section className="px-4 md:px-6 pb-12">
      <div className="mt-2 rounded-2xl border p-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold">Ready to launch?</h3>
        <p className="mt-1 text-gray-600">
          Publish your site with SSL and fast hosting in minutes.
        </p>
        <div className="mt-4">
          <Link
            href={`/hosting?template=${encodeURIComponent(slug)}`}
            className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}
