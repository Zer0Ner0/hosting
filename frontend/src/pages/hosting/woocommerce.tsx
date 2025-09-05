// frontend/src/pages/hosting/woocommerce.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import FAQ from "@/components/common/FAQ";
import TablePlans from "@/components/home/TablePlans";
import FeatureRow from "@/components/home/FeatureRow";

export default function WooCommerceHostingPage(): JSX.Element {
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
      q: "How do I host a WooCommerce website?",
      a: (
        <p className="p-4">
          Once you sign up for our WooCommerce hosting service, your online store
          will be deployed. You can then import products and customize your
          WordPress storefront easily in your browser—no coding required.
        </p>
      ),
    },
    {
      q: "How do I pick the right WooCommerce hosting?",
      a: (
        <p className="p-4">
          For new stores, start with Starter or Plus Cloud. For higher traffic
          or large product catalogs, Turbo or Business Cloud provides the
          resources to scale smoothly.
        </p>
      ),
    },
    {
      q: "Why use WooCommerce?",
      a: (
        <p className="p-4">
          WooCommerce is built on WordPress, giving you full control of your
          store data. It’s flexible, customizable, SEO-friendly, and scalable—
          ideal for online businesses of all sizes.
        </p>
      ),
    },
    {
      q: "How do I claim my free SSL certificate?",
      a: (
        <p className="p-4">
          Once your store is online and connected to your domain, a free SSL
          certificate is automatically generated and installed to keep your
          store secure.
        </p>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>WooCommerce Hosting — Fast & Secure | YourBrand</title>
        <meta
          name="description"
          content="Fast, secure, and scalable WooCommerce hosting with free SSL, daily backups, and 24/7 support."
        />
      </Head>

      {/* Hero */}
      <section
        className="relative overflow-hidden bg-neutral-900"
        aria-label="Hero: WooCommerce Hosting"
      >
        <div className="relative aspect-[1792/728] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
          <Image
            src="/images/hero-section.svg"
            alt="Fast WooCommerce Hosting"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              WooCommerce Hosting Made Easy
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/90">
              Powerful WooCommerce hosting plans with LiteSpeed, NVMe, and
              24/7/365 support.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#packages"
                className="btn-primary px-6 py-3 text-base font-semibold"
                aria-label="Browse WooCommerce plans"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="packages" aria-label="WooCommerce plans" className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Choose Your WooCommerce Hosting Plan
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-600">
            Flexible plans for businesses of all sizes—scale when you grow.
          </p>
          <div className="mt-8">
            <TablePlans fixedCategory="woocommerce" />
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section
        className="bg-white"
        aria-labelledby="why-choose-woocommerce-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2
            id="why-choose-woocommerce-heading"
            className="font-heading text-3xl sm:text-4xl font-extrabold text-center text-neutral-900"
          >
            Why Choose YourBrand For WooCommerce Hosting
          </h2>
          <p className="mt-4 text-lg text-center text-neutral-600">
            Speed, reliability, and security—everything your online store needs
            to thrive.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center">
              <Image
                src="/images/features/domain.svg"
                alt="Free domain"
                width={64}
                height={64}
                className="mx-auto h-16 w-16"
              />
              <h3 className="mt-4 font-semibold">Free Domain</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Claim your free domain with Turbo or Business plans and secure
                your brand identity.
              </p>
            </div>
            <div className="text-center">
              <Image
                src="/images/features/ssl.svg"
                alt="Free SSL"
                width={64}
                height={64}
                className="mx-auto h-16 w-16"
              />
              <h3 className="mt-4 font-semibold">Free SSL</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Keep transactions safe with automatic SSL certificates for all
                stores.
              </p>
            </div>
            <div className="text-center">
              <Image
                src="/images/features/money-back.svg"
                alt="30-day guarantee"
                width={64}
                height={64}
                className="mx-auto h-16 w-16"
              />
              <h3 className="mt-4 font-semibold">30-Day Guarantee</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Try with confidence—full refund within 30 days if you’re not
                satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="bg-neutral-50"
        aria-labelledby="woocommerce-features-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2
            id="woocommerce-features-heading"
            className="font-heading text-3xl sm:text-4xl font-extrabold text-center text-neutral-900"
          >
            Optimize Your Store Performance
          </h2>
          <div className="mt-12 space-y-12">
            <FeatureRow
              title="Faster Load Times"
              copy="LiteSpeed + NVMe + Quic.Cloud deliver lightning-fast WooCommerce performance."
              imageSrc="/images/features/instant-setup.svg"
              imageAlt="Instant setup illustration"
              imageLeft
              imageContain
            />
            <FeatureRow
              title="Enterprise Hardware"
              copy="Our private cloud runs on AMD EPYC CPUs with redundant hypervisors and 20Gbps uplinks."
              imageSrc="/images/features/faster-performance.svg"
              imageAlt="Performance stack illustration"
              imageContain
            />
            <FeatureRow
              title="Scale With Ease"
              copy="Upgrade seamlessly with one-click resource scaling—no downtime or migrations."
              imageSrc="/images/features/uptime.svg"
              imageAlt="Uptime illustration"
              imageLeft
              imageContain
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" aria-labelledby="faqs-heading" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <FAQ
            items={faqs}
            heading="Frequently Asked Questions About WooCommerce Hosting"
            subheading="Quick answers to common questions."
          />
        </div>
      </section>
    </>
  );
}
