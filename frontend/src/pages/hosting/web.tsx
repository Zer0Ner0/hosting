// frontend/src/pages/hosting/web.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import TablePlans from "@/components/home/TablePlans";
import PlanComparison from "@/components/home/PlanComparison";
import Testimonials from "@/components/home/Testimonials";

export default function WebHostingPage(): JSX.Element {
  const router = useRouter();

  // Smooth scroll to hash
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;
    let tries = 0;
    const maxTries = 10;
    const tick = (): void => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (++tries < maxTries) setTimeout(tick, 100);
    };
    setTimeout(tick, 0);
  }, [router.asPath]);

  interface FAQItem {
    q: string;
    a: ReactNode;
  }

  const faqs: FAQItem[] = [
    {
      q: "What is website hosting?",
      a: (
        <p className="p-4">
          Web hosting is a service that makes your website available online. Providers supply storage space, infrastructure, and technology. At YourBrand, we also include features like free SSL and a website builder.
        </p>
      ),
    },
    {
      q: "What is a web hosting package?",
      a: (
        <p className="p-4">
          A hosting plan is a bundle of resources—storage, bandwidth, features—suited to your needs. Plans may support multiple websites, WordPress, or include a free domain.
        </p>
      ),
    },
    {
      q: "What is shared vs dedicated hosting?",
      a: (
        <p className="p-4">
          Shared hosting means multiple websites share a server. Dedicated hosting gives you a server for yourself. Choose based on performance needs and budget.
        </p>
      ),
    },
    {
      q: "What is email hosting?",
      a: (
        <p className="p-4">
          Email hosting provides secure, professional email accounts on your domain with spam filtering and backups.
        </p>
      ),
    },
  ];

  const benefits = [
    { title: "Free SSL & daily backups", desc: "Security by default with one-click restore." },
    { title: "24/7 expert support", desc: "Real humans who actually fix things—fast." },
    { title: "NVMe + HTTP/3 stack", desc: "Low TTFB and blazing page loads." },
    { title: "One-click scaling", desc: "Upgrade resources without migrations." },
  ];

  return (
    <>
      <Head>
        <title>Web Hosting — Fast & Secure | YourBrand</title>
        <meta
          name="description"
          content="Fast, secure, and affordable web hosting with free SSL, daily backups, and 24/7 support."
        />
      </Head>

      {/* Hero */}
      <section
        className="relative overflow-hidden bg-neutral-900"
        aria-label="Hero: Fast hosting and domains"
      >
        <div className="relative aspect-[1792/728] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
          <Image
            src="/images/hero-section.svg"
            alt="Fast NVMe Web Hosting"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Award Winning Web Hosting In Just A Few Clicks
            </h1>
            <ul
              role="list"
              className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-lg text-white/90 max-w-4xl"
            >
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                  ✓
                </span>
                <span>
                  <strong>Blazing Fast</strong> Website Speed
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                  ✓
                </span>
                <span>
                  <strong>Easy To Use</strong> Platform
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                  ✓
                </span>
                <span>
                  <strong>Reliable Hosting</strong> That Scales
                </span>
              </li>
            </ul>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#packages"
                className="btn-primary px-6 py-3 text-base font-semibold"
                aria-label="Browse hosting plans"
              >
                Get Started Now
              </a>
            </div>
            <p className="mt-6 text-sm text-white/80">
              Trusted by{" "}
              <span className="font-semibold text-white">40,000+</span> customers and{" "}
              <span className="font-semibold text-white">750,000+</span> websites.
            </p>
          </div>
        </div>
      </section>

      {/* Trust + Benefits */}
      <TrustBar />
      <BenefitsStrip items={benefits} />

      {/* Plans */}
      <section id="packages" aria-label="Popular plans" className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Choose Your Web Hosting Plan
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-600">
            Choose a plan and scale when you grow.
          </p>
          <div className="mt-8">
            <TablePlans fixedCategory="web" />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <PlanComparison category="web" anchorId="web-comparison" />

      {/* Testimonials */}
      <section className="bg-emerald-900" aria-label="Customer testimonials">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-white">
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" aria-labelledby="faqs-heading" className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <FAQ
            items={faqs}
            heading="Frequently Asked Questions About Web Hosting"
            subheading="Quick answers to common questions."
          />
        </div>
      </section>
    </>
  );
}
