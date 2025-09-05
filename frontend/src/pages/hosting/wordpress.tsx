// frontend/src/pages/hosting/wordpress.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import FAQ from "@/components/common/FAQ";
import TablePlans from "@/components/home/TablePlans";
import PlanComparison from "@/components/home/PlanComparison";
import Testimonials from "@/components/home/Testimonials";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const speedData = [
  { feature: "LiteSpeed", value: 69618.5 },
  { feature: "Nginx", value: 6025.3 },
  { feature: "Apache", value: 826.5 },
];

const maxValue = Math.max(...speedData.map((d) => d.value));

export default function WordPressHostingPage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
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
      q: "Why should I choose WordPress?",
      a: (
        <p className="p-4">
          WordPress is user-friendly, customizable with thousands of plugins,
          SEO-friendly, scalable, supported by a large community, and
          cost-effective. It’s a versatile platform suitable for blogs,
          business, and e-commerce.
        </p>
      ),
    },
    {
      q: "Is WordPress good for an online store?",
      a: (
        <p className="p-4">
          Yes. With WooCommerce and plugins, WordPress is a robust e-commerce
          solution for selling products or services online.
        </p>
      ),
    },
    {
      q: "What’s the difference between managed and shared WordPress hosting?",
      a: (
        <p className="p-4">
          Managed WordPress hosting provides isolated resources, automatic
          updates, backups, and enhanced security. Shared WordPress hosting
          shares resources and requires more self-management. Choose based on
          traffic, performance needs, and budget.
        </p>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>WordPress Hosting — Fast & Secure | YourBrand</title>
        <meta
          name="description"
          content="Fast, secure, and affordable WordPress hosting with free SSL, daily backups, and 24/7 support."
        />
      </Head>

      {/* Hero */}
      <section
        className="relative overflow-hidden bg-neutral-900"
        aria-label="Hero: WordPress Hosting"
      >
        <div className="relative aspect-[1792/728] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
          <Image
            src="/images/hero-section.svg"
            alt="Fast WordPress Hosting"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              WordPress Hosting Made Easy
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/90">
              Best-in-class WordPress hosting with LiteSpeed + NVMe and 24/7
              support.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#packages"
                className="btn-primary px-6 py-3 text-base font-semibold"
                aria-label="Browse WordPress plans"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="packages" aria-label="WordPress plans" className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Choose Your WordPress Hosting Plan
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-600">
            Pick the right plan for your WordPress site and scale as you grow.
          </p>
          <div className="mt-8">
            <TablePlans fixedCategory="wordpress" />
          </div>
        </div>
      </section>

      {/* Performance Chart */}
      <section
        className="bg-white"
        aria-labelledby="performance-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2
            id="performance-heading"
            className="text-3xl sm:text-4xl font-heading font-extrabold text-neutral-900 text-center"
          >
            Blazing Fast WordPress Performance
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-80 max-w-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={speedData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="feature"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={120}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      <LabelList
                        dataKey="value"
                        position="right"
                        className="fill-neutral-800 text-sm"
                      />
                      {speedData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={
                            entry.value === maxValue
                              ? "#166534" // emerald-900
                              : "#D1D5DB" // gray-300
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-neutral-600 text-center">
                Requests Per Second (100 Users)
              </p>
            </div>
            <div className="space-y-6 text-neutral-700">
              <p>
                Our WordPress cloud hosting is optimized with AMD EPYC CPUs,
                NVMe storage, and LiteSpeed caching to deliver unmatched speed.
              </p>
              <p>
                Easily accelerate your site with our free caching plugin and
                enjoy redundant 20Gbps uplinks for maximum uptime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <PlanComparison category="wordpress" anchorId="wp-comparison" />

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
            heading="Frequently Asked Questions About WordPress Hosting"
            subheading="Quick answers to common questions."
          />
        </div>
      </section>
    </>
  );
}
