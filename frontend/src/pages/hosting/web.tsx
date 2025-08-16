import Head from "next/head";
import DomainSearchBox from "@/components/home/DomainSearchBox";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import HomepageHostingPlans from "@/components/home/HomepageHostingPlans";

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

      <FAQ items={faqs} heading="Web Hosting FAQs" subheading="Quick answers to common questions." />
    </>
  );
}
