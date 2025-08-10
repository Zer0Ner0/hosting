// frontend/src/components/web_builder/HeroBuilder.tsx
import Link from "next/link";

export default function HeroBuilder() {
  return (
    <section
      className="relative overflow-hidden border-b"
      aria-labelledby="builder-hero-title"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-pink-50" />
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1
            id="builder-hero-title"
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Build a beautiful website in minutes.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Pick a template, customise sections, and publish on fast, secure
            hosting. No coding needed—keep full flexibility when you want it.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/hosting"
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Get Hosting & Publish
            </Link>
            <a
              href="#templates"
              className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Browse Templates
            </a>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Free templates • SEO-ready • One-click publish • Malaysia-friendly
          </div>
        </div>
      </div>
    </section>
  );
}