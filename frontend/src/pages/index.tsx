// /frontend/src/pages/index.tsx

import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DomainSearchBox from "@/components/home/DomainSearchBox";
import TablePlans from "@/components/home/TablePlans";
import FaqSection from "@/components/home/FaqSection";
import Testimonials from "@/components/home/Testimonials";
import TrustBar from "@/components/home/TrustBar";
import FeatureRow from "@/components/home/FeatureRow";
import HighlightsStrip from "@/components/home/HighlightsStrip";

// Networking pattern: centralize API base
const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

const CATEGORIES = ["web", "wordpress", "email", "woocommerce"] as const;

export default function HomePage(): JSX.Element {
  const router = useRouter();

  useEffect((): (() => void) | void => {
    // Client-side only
    if (typeof window === "undefined") return;

    // Preload once per session for snappier UX
    if (sessionStorage.getItem("preload:plans:done")) {
      router.prefetch("/hosting");
      return;
    }

    const ac = new AbortController();

    const loadCategory = async (
      cat: (typeof CATEGORIES)[number]
    ): Promise<void> => {
      try {
        const [specRes, priceRes] = await Promise.all([
          fetch(`${API_BASE}/api/plans/specs/?category=${cat}`, {
            signal: ac.signal,
          }),
          fetch(`${API_BASE}/api/plans/?category=${cat}`, {
            signal: ac.signal,
          }),
        ]);

        if (specRes.ok) {
          const specData = await specRes.json();
          sessionStorage.setItem(
            `preload:specs:${cat}`,
            JSON.stringify(specData)
          );
        }
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          sessionStorage.setItem(
            `preload:prices:${cat}`,
            JSON.stringify(priceData)
          );
        }
      } catch {
        // Swallow; on-demand fetch handles fallback
      }
    };

    CATEGORIES.forEach(loadCategory);
    sessionStorage.setItem("preload:plans:done", "1");

    // Prefetch hosting page route for fast nav
    router.prefetch("/hosting");

    return () => ac.abort();
  }, [router]);

  return (
    <>
      <Head>
        <title>Hosting My - Fast Web Hosting &amp; Domains Made Easy</title>
        <meta
          name="description"
          content="Lightning-fast NVMe web hosting with LiteSpeed, free SSL, and 24/7 expert support."
        />
      </Head>

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-white"
        aria-label="Hero: Fast hosting and domains"
      >
        <div className="mx-auto w-full max-w-[1920px]">
          {/* Aspect-ratio wrapper */}
          <div className="relative aspect-[1792/728] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
            {/* Background image (decorative) */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero-section.svg"
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center text-center">
                <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  Summer Savings Event: Up to 75% Off!
                </div>
                <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Fast Hosting &amp; Domains Made Easy
                </h1>
                <p className="mx-auto mt-3 max-w-2xl font-sans text-base/7 text-white/90">
                  Blazing fast NVMe + LiteSpeed, free &amp; auto SSL, and
                  24/7/365 SuperHero support.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="/hosting"
                    className="btn-primary inline-flex items-center justify-center rounded-lg px-6 py-3 font-sans text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-white/70"
                    aria-label="Browse hosting plans"
                  >
                    Get Started Now
                  </a>
                </div>
                <p className="mt-6 font-sans text-sm text-white/80">
                  Proudly trusted by over{" "}
                  <span className="font-semibold text-white">40,000+</span>{" "}
                  customers and{" "}
                  <span className="font-semibold text-white">750,000+</span>{" "}
                  websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HighlightsStrip />

      {/* PLANS TEASER */}
      <section aria-label="Popular plans" className="bg-white">
        <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Everything you need to succeed online
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center font-sans text-neutral-600">
            Choose a plan and scale when you grow.
          </p>
          <div className="mt-8">
            <TablePlans />
            <TrustBar />
          </div>
        </div>
      </section>

      {/* DOMAIN SEARCH */}
      <section
        className="bg-[#166534] text-white"
        aria-label="Find your domain"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">
            Your Online Journey Starts With A Perfect Domain
          </h2>
          <div className="mt-6">
            <DomainSearchBox />
          </div>
        </div>
      </section>

      {/* FEATURE ROWS */}
      <FeatureRow
        title="Instant Website Setup"
        copy="No tech skills needed—launch on our high-speed cloud in minutes. Manage content, email, and domains easily, and build secure online stores with free SSL that rank higher in search results."
        imageSrc="/images/features/instant-setup.svg"
        imageAlt="Instant website setup illustration"
        imageLeft
        imageContain
      />

      <FeatureRow
        title="20x Faster Performance"
        copy="Slow sites lose visitors and rankings. We deliver blazing-fast load times so your website stays competitive."
        imageSrc="/images/features/faster-performance.svg"
        imageAlt="Performance stack illustration"
        imageContain
      />

      <FeatureRow
        title="99.9% Uptime Guaranteed"
        copy="Downtime costs sales and trust. Since 2015, we’ve ensured near-perfect uptime for every site—big or small—at a price that fits your budget."
        imageSrc="/images/features/uptime.svg"
        imageAlt="Uptime guarantee illustration"
        imageLeft
        imageContain
      />

      <FeatureRow
        title="Tailored Website Security"
        copy="Security isn’t one-size-fits-all. Our Security Shield uses machine learning to block threats before they strike—complete with real-time malware scans and automatic patching to keep your site safe."
        imageSrc="/images/features/security.svg"
        imageAlt="Security shield with monitoring"
        imageContain
      />

      {/* SOCIAL PROOF */}
      <section
        className="bg-[#1F2937] text-white"
        aria-label="Customer testimonials"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white" aria-label="Frequently asked questions">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
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
