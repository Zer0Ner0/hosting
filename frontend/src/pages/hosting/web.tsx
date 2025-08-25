import Head from "next/head";
import DomainSearchBox from "@/components/home/DomainSearchBox";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import TablePlans from "@/components/home/TablePlans";
import Image from "next/image";

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

      {/* HERO — full-bleed, dark overlay, fluid aspect (1792:728) with no inner padding */}
      <section className="relative isolate overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-section.svg"
            alt="Fast NVMe Web Hosting"
            fill
            priority
            className="object-cover"
          />
          {/* <div className="absolute inset-0 bg-black/55" /> */}
        </div>
        {/* keep 1792:728 proportion on small screens; lock height on md+ */}
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{ minHeight: "min(728px, 85vh)" }}>
            <div className="w-full text-center text-white">
              <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Award Winning Web Hosting In Just A Few Clicks
              </h1>
              <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-6 text-lg opacity-90 max-w-4xl">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                  <span><strong>Blazing Fast</strong> Website Speed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                  <span><strong>Easy To Use,</strong> Guru-Free Platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                  <span><strong>Reliable Hosting</strong> That Scales</span>
                </li>
              </ul>
              <p className="mt-3 text-base">Proudly Trusted By Over
                <span className="font-semibold"> 750,000+ Websites</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip directly under hero */}
      <TrustBar />

      <BenefitsStrip items={benefits} />

      <section aria-label="Popular plans" className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#000000] font-['DM_Sans']">
            Choose Your Web Hosting Plan
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[#727586] font-['DM_Sans']">
            Choose a plan and scale when you grow.
          </p>
          <div className="mt-auto">
            <TablePlans fixedCategory="web" />
          </div>
        </div>
      </section>

      <FAQ
        items={faqs}
        heading="Web Hosting FAQs"
        subheading="Quick answers to common questions."
      />

      {/* Feature Strip below FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Affordable Power */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/affordable-power.svg"
                  alt="Affordable Power"
                  width={60}
                  height={60}
                  className="h-14 w-14"
                />
              </div>
              <h3 className="text-lg font-semibold">Affordable Power</h3>
              <p className="mt-2 text-sm text-gray-600">
                Blazing fast premium cloud web hosting services that are easily scaled and affordable.
              </p>
            </div>

            {/* Complete Control */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/complete-control.svg"
                  alt="Complete Control"
                  width={60}
                  height={60}
                  className="h-14 w-14"
                />
              </div>
              <h3 className="text-lg font-semibold">Complete Control</h3>
              <p className="mt-2 text-sm text-gray-600">
                Easily build and manage your website to fit your specific needs in a "guru free" control panel.
              </p>
            </div>

            {/* Unmatched Secure Hosting */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/unmatched-security.svg"
                  alt="Unmatched Secure Hosting"
                  width={60}
                  height={60}
                  className="h-14 w-14"
                />
              </div>
              <h3 className="text-lg font-semibold">Unmatched Secure Hosting</h3>
              <p className="mt-2 text-sm text-gray-600">
                Protect your reputation, business, and brand with our unique Security Shield, included free in our hosting packages.
              </p>
            </div>

            {/* Supreme Reliability */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/supreme-reliability.svg"
                  alt="Supreme Reliability"
                  width={60}
                  height={60}
                  className="h-14 w-14"
                />
              </div>
              <h3 className="text-lg font-semibold">Supreme Reliability</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sleep soundly knowing your website is up and running around the clock, with real SuperHeroes monitoring 24/7, 365.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Light comparison snapshot (in-page, no extra component file) */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#2F1C6A] font-['DM_Sans']">
            How We Compare
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-2xl border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Feature</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-700">Our Web Hosting</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Typical Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[
                  ["NVMe storage", "Included", "SATA SSD / HDD"],
                  ["LiteSpeed Web Server", "All plans", "Limited tiers"],
                  ["Free SSL", "All domains", "Sometimes paid"],
                  ["Daily Backups", "Yes", "Weekly or paid"],
                  ["cPanel", "Yes", "Varies"],
                  ["24/7 Support", "Yes", "Varies"],
                ].map(([label, us, others]) => (
                  <tr key={label}>
                    <td className="px-4 py-3 text-sm">{label}</td>
                    <td className="px-4 py-3 text-sm font-medium text-emerald-700">{us}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
