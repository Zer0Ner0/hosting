import Head from "next/head";
import DomainSearchBox from "@/components/home/DomainSearchBox";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import PlansCompareMatrix from "@/components/hosting/PlansCompareMatrix";
import { EMAIL_FEATURE_TOOLTIPS } from "@/content/tooltips/email";

export default function WebHostingPage() {
  const faqs = [
    {
      q: "What’s included with Web Hosting?",
      a: "Free SSL, malware scanning, daily backups, and 24/7 support. You can upgrade resources anytime.",
    },
    {
      q: "Can I migrate my existing site?",
      a: "Yes. Start a plan, give us your current host login or a backup, and we’ll help you move with minimal downtime.",
    },
    {
      q: "Is there a traffic limit?",
      a: "Plans are sized by resources (CPU/RAM/storage). If you outgrow a plan, upgrade instantly without migration.",
    },
    {
      q: "Do you support custom domains?",
      a: "Absolutely. Search and register a new domain here, or connect one you already own via simple DNS updates.",
    },
  ];

  const benefits = [
    { title: "Free SSL & daily backups", desc: "Security by default with one-click restore." },
    { title: "24/7 expert support", desc: "Humans who actually fix things—fast." },
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

      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Lightning-Fast Web Hosting</h1>
              <p className="mt-4 text-lg text-gray-600">
                Powered by modern stack & security hardening. Launch your site with confidence.
              </p>
              <div className="mt-6">
                <DomainSearchBox />
              </div>
            </div>
            <div className="lg:justify-self-end">
              <img src="/images/hero-hosting.svg" alt="Web hosting" className="w-full max-w-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip directly under hero */}
      <TrustBar />

      <BenefitsStrip items={benefits} />

      <PlansCompareMatrix
              category="web"
              title="Web Hosting plans & features"
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

      <FAQ items={faqs} heading="Web Hosting FAQs" subheading="Quick answers to common questions." />
    </>
  );
}
