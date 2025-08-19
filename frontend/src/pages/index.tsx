import Head from "next/head";
import Image from "next/image";
import DomainSearchBox from "@/components/home/DomainSearchBox";
import HomepageHostingPlans from "@/components/home/HomepageHostingPlans";
import FaqSection from "@/components/home/FaqSection";
import Testimonials from "@/components/home/Testimonials";
import TrustBar from "@/components/home/TrustBar";
import FeatureRow from "@/components/home/FeatureRow";
import HighlightsStrip from "@/components/home/HighlightsStrip";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Fast NVMe Web Hosting • YourBrand</title>
        <meta
          name="description"
          content="Lightning-fast NVMe web hosting with LiteSpeed, free SSL, and 24/7 expert support."
        />
      </Head>

      {/* HERO */}
      {/* <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                High-Speed Cloud Hosting
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Launch faster on NVMe + LiteSpeed
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-600">
                Get secure, scalable hosting with automatic SSL, one-click WordPress, and
                24/7 expert support. Perfect for personal sites, businesses, and agencies.
              </p>

              <div className="mt-6">
                <DomainSearchBox />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>Free SSL</span>
                <span>•</span>
                <span>Free Migrations</span>
                <span>•</span>
                <span>7-Day Refund</span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border bg-white shadow-lg">
                <Image src="/images/hosting.jpg" alt="Hosting control panel & performance illustration" fill className="object-cover" priority sizes="(min-width: 1024px) 560px, 100vw" />
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* HERO — NameHero-style with background image (fluid 1792:728) */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto w-full max-w-[1920px]">
          {/* Aspect-ratio wrapper */}
          <div className="relative aspect-[1792/728] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
            {/* background image */}
            <div className="absolute inset-0">
              <img
                src="/images/hero-section.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* content */}
            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center text-center">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Summer Savings Event: Up to 75% Off!
                </div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#2F1C6A] sm:text-5xl">
                  Fast Hosting &amp; Domains Made Easy
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-base/7 text-[#2F1C6A]">
                  Blazing fast NVMe + LiteSpeed, free &amp; auto SSL, and 24/7/365 SuperHero support.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="/hosting"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Get Started Now
                  </a>
                </div>
                <p className="mt-6 text-sm text-slate-500">
                  Proudly trusted by over <span className="font-semibold text-slate-700">40,000+</span> customers and{" "}
                  <span className="font-semibold text-slate-700">750,000+</span> websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
      <HighlightsStrip />

      {/* PLANS TEASER (pulls from /api/plans) */}
      <section aria-label="Popular plans" className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#2F1C6A] font-['DM_Sans']">
            Everything you need to succeed online
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[#727586] font-['DM_Sans']">
            Choose a plan and scale when you grow.
          </p>
          <div className="mt-8">
            <HomepageHostingPlans />
          </div>
        </div>
      </section>

      {/* FEATURE ROWS (mirror NH’s alternating blocks) */}
      <FeatureRow
        eyebrow="Performance"
        title="Launch faster on NVMe + LiteSpeed"
        copy="NVMe storage, HTTP/3, and server-level caching tuned for WordPress and custom apps."
        bullets={["NVMe SSD", "LiteSpeed + QUIC", "Global CDN-ready"]}
        imageSrc="/images/features/performance.jpg"
        imageAlt="Performance stack illustration"
        imageLeft
        imageContain // it's an SVG
      />

      <FeatureRow
        eyebrow="Security"
        title="Always-on protection"
        copy="Imunify360 malware defense, Web Application Firewall, and free SSL across all plans."
        bullets={["Imunify360", "WAF", "Auto SSL"]}
        imageSrc="/images/features/security.jpg"
        imageAlt="Security shield with monitoring"
        imageContain
      />

      {/* SOCIAL PROOF */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-6">
            <FaqSection />
          </div>
        </div>
      </section>
    </>
  );
}
