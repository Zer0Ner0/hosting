import Head from "next/head";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import { EMAIL_FEATURE_TOOLTIPS } from "@/content/tooltips/email";
import PlansCompareMatrix from "@/components/hosting/PlansCompareMatrix";

export default function WordPressHostingPage() {
  const faqs = [
    {
      q: "Is this managed WordPress hosting?",
      a: "Yes. One-click installs, automatic core updates, and WordPress-tuned caching are included.",
    },
    {
      q: "Can I use my favorite themes & plugins?",
      a: "Of course. Bring any theme/plugin. For performance and security, avoid abandoned or unsafe plugins.",
    },
    {
      q: "How do you handle backups?",
      a: "Automatic daily backups with quick restores from the dashboard. You can also trigger on-demand backups.",
    },
    {
      q: "Will my site be fast?",
      a: "We optimize for WordPress with server-level caching and CDN support to keep TTFB low and pages snappy.",
    },
  ];

  const benefits = [
    { title: "Managed updates", desc: "Core, themes & plugins kept current." },
    { title: "WP-tuned caching", desc: "Server-level cache & CDN ready." },
    { title: "Free migrations", desc: "We’ll move your WP site for you." },
    { title: "Staging & backups", desc: "Test changes safely, restore in clicks." },
  ];

  return (
    <>
      <Head>
        <title>WordPress Hosting — Optimized & Secure | YourBrand</title>
        <meta
          name="description"
          content="Managed WordPress hosting optimized for speed, security, and hassle-free updates."
        />
      </Head>

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Managed WordPress Hosting</h1>
              <p className="mt-4 text-lg text-gray-600">
                One-click installs, automatic updates, and WP-tuned performance.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <img src="/images/hero-hosting.svg" alt="WordPress hosting" className="w-full max-w-lg" />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <BenefitsStrip items={benefits} />

      <PlansCompareMatrix
        category="wordpress"
        title="WordPress Hosting plans & features"
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

      <FAQ items={faqs} heading="WordPress Hosting FAQs" subheading="Answers for common WordPress scenarios." />
    </>
  );
}
