import Head from "next/head";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import PlansCompareMatrix from "@/components/hosting/PlansCompareMatrix";
import { EMAIL_FEATURE_TOOLTIPS } from "@/content/tooltips/email";

export default function WooCommerceHostingPage() {
  const faqs = [
    {
      q: "Is this suitable for growing stores?",
      a: "Yes. Start small and scale resources (CPU/RAM/storage) without migrations as traffic and orders increase.",
    },
    {
      q: "Do you support payment gateways & SSL?",
      a: "Yes. Free SSL is included and popular payment gateways work out of the box with WooCommerce.",
    },
    {
      q: "How about speed during sales?",
      a: "Server-level caching and CDN keep product pages and carts responsive even during traffic spikes.",
    },
    {
      q: "Can you migrate my WooCommerce store?",
      a: "We can assist with a guided migration to preserve products, orders, customers, and SEO URLs.",
    },
  ];

  const benefits = [
    { title: "Checkout that flies", desc: "Edge cache + HTTP/3 keep carts fast." },
    { title: "PCI-friendly stack", desc: "Free SSL and hardened config." },
    { title: "Scale for sales", desc: "Handle spikes on launch days." },
    { title: "Store-safe backups", desc: "Protect orders, products & customers." },
  ];

  return (
    <>
      <Head>
        <title>WooCommerce Hosting — Sell Faster | YourBrand</title>
        <meta
          name="description"
          content="WooCommerce hosting optimized for conversions with performance and security out of the box."
        />
      </Head>

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">WooCommerce Hosting</h1>
              <p className="mt-4 text-lg text-gray-600">
                PCI-friendly stack, caching, and CDN to keep carts blazing fast.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <img src="/images/hero-hosting.svg" alt="WooCommerce hosting" className="w-full max-w-lg" />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <BenefitsStrip items={benefits} />

      <PlansCompareMatrix
        category="woocommerce"
        title="WooCommerce Hosting plans & features"
        subtitle="Pick a plan and compare what's included."
        features={[
          "Web Storage",
          "Web Accounts",
          "POP3/IMAP/SMTP",
          "Web Based Email",
          "Superior Spam Protection",
          "Premium Email Deliverability",
          "Integrated Calendar",
          "FREE Migration",
          "30-Day Money-Back",
        ]}
        featureTooltips={EMAIL_FEATURE_TOOLTIPS}
        enableBillingToggle={true}
      />

      <FAQ items={faqs} heading="WooCommerce Hosting FAQs" subheading="Short answers for store owners." />
    </>
  );
}
