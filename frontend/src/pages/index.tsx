import Head from "next/head";
import Image from "next/image";
import Layout from "@/components/Layout";
import DomainSearchBox from "@/components/DomainSearchBox";
import HomepageHostingPlans from "@/components/HomepageHostingPlans";
import FaqSection from "@/components/FaqSection";
import Testimonials from "@/components/Testimonials";

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
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
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
      </section>

      <TrustBar />
      <HighlightsStrip />

      {/* PLANS TEASER (pulls from /api/plans) */}
      <section aria-label="Popular plans" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to succeed online
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
            Choose a plan and scale when you grow. Pay monthly or yearly.
          </p>
          <div className="mt-8">
            <HomepageHostingPlans />
          </div>
        </div>
      </section>

      {/* FEATURE ROWS (mirror NH’s alternating blocks) */}
      <FeatureRow
        eyebrow="Maximum Performance"
        title="LiteSpeed + LSCache for instant page loads"
        copy="Our stack is tuned for speed from the kernel up. Pair LiteSpeed with NVMe storage and built-in object cache for blazing-fast sites."
        bullets={[
          "HTTP/3 + QUIC ready",
          "Server-level caching (no plugins required)",
          "NVMe SSD across all shared tiers",
        ]}
        imageSrc="/images/placeholders/template-1.svg"
        imageAlt="Performance stack"
        imageLeft
      />

      <FeatureRow
        eyebrow="Secure by Default"
        title="Free SSL, WAF & malware protection"
        copy="We harden every account with proactive security so you can focus on your business, not patches."
        bullets={[
          "Automatic SSL & renewals",
          "Web Application Firewall",
          "Daily malware scans & isolation",
        ]}
        imageSrc="/images/placeholders/template-2.svg"
        imageAlt="Security overview"
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
