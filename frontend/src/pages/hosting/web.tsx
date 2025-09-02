import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import TablePlans from "@/components/home/TablePlans";
import PlanComparison from "@/components/home/PlanComparison";
import Image from "next/image";

export default function WebHostingPage() {
  const router = useRouter();

  useEffect(() => {
    // Scroll to hash after client navigation (with a few retries)
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;

    let tries = 0;
    const maxTries = 10;          // ~1s total
    const interval = 100;         // ms
    const tick = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (++tries < maxTries) setTimeout(tick, interval);
    };
    // Kick off once the route (and layout) is ready
    setTimeout(tick, 0);
  }, [router.asPath]);

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

      {/* Feature Strip below FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Affordable Power */}
            <div className="flex flex-col items-center text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/affordable-power.svg"
                  alt="Affordable Power"
                  width={60}
                  height={60}
                  className="h-24 w-24"
                />
              </div>
              <h3 className="text-lg font-semibold text-[20px]">Affordable Power</h3>
              <p className="mt-2 text-sm text-gray-600 text-[16px]">
                Blazing fast premium cloud web hosting services that are easily scaled and affordable.
              </p>
            </div>

            {/* Complete Control */}
            <div className="flex flex-col items-center text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/complete-control.svg"
                  alt="Complete Control"
                  width={60}
                  height={60}
                  className="h-24 w-24"
                />
              </div>
              <h3 className="text-lg font-semibold text-[20px]">Complete Control</h3>
              <p className="mt-2 text-sm text-gray-600 text-[16px]">
                Easily build and manage your website to fit your specific needs in a "guru free" control panel.
              </p>
            </div>

            {/* Unmatched Secure Hosting */}
            <div className="flex flex-col items-center text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/unmatched-security.svg"
                  alt="Unmatched Secure Hosting"
                  width={60}
                  height={60}
                  className="h-24 w-24"
                />
              </div>
              <h3 className="text-lg font-semibold text-[20px]">Unmatched Secure Hosting</h3>
              <p className="mt-2 text-sm text-gray-600 text-[16px]">
                Protect your reputation, business, and brand with our unique Security Shield, included free in our hosting packages.
              </p>
            </div>

            {/* Supreme Reliability */}
            <div className="flex flex-col items-center text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/supreme-reliability.svg"
                  alt="Supreme Reliability"
                  width={60}
                  height={60}
                  className="h-24 w-24"
                />
              </div>
              <h3 className="text-lg font-semibold text-[20px]">Supreme Reliability</h3>
              <p className="mt-2 text-sm text-gray-600 text-[16px]">
                Sleep soundly knowing your website is up and running around the clock, with real SuperHeroes monitoring 24/7, 365.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <h2 className="text-[40px] font-extrabold text-center text-white leading-tight">
            Why Choose YourBrand as Your Web Hosting Service Provider
          </h2>

          {/* Subheader */}
          <p className="mt-4 text-[20px] text-center text-white">
            Did you know that poor loading speeds are one of the main reasons
            visitors leave websites before viewing them?
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left text block */}
            <div className="space-y-6 text-white">
              <p className="text-[18px] leading-relaxed">
                By choosing our web hosting services, you get guaranteed
                lightning-fast site performance to ensure you create an
                excellent first impression.
              </p>
              <p className="text-[18px] leading-relaxed">
                Our goal is to provide you with the best web hosting services,
                around-the-clock support, and hosting plans that suit your
                budget, with a money-back guarantee.
              </p>
              <p className="text-[18px] leading-relaxed">
                Boost your sales and internet presence, and improve your bottom
                line with web hosting features designed for your web project.
              </p>
            </div>

            {/* Right image */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/illustrations/why-choose.svg"
                alt="Why Choose Illustration"
                width={420}
                height={320}
                className="max-w-full h-auto"
              />
            </div>

            <div className="pt-4 items-center justify-center text-center md:col-span-2">
              <a
                href="/hosting"
                className="inline-block px-8 py-4 bg-[#FF7A00] text-white font-semibold rounded-md shadow-md hover:bg-[#e56c00] transition"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Managed WordPress Hosting On Steroids */}
      <section className="">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left single image */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/wp-on-steroids/wp-illustration.svg"
                alt="WordPress Hosting Illustration"
                width={520}
                height={420}
                className="max-w-full h-auto"
              />
            </div>

            {/* Right content */}
            <div className="lg:pl-10">
              <h2 className="text-[40px] font-bold leading-tight">
                Managed WordPress Hosting On Steroids
              </h2>

              <p className="mt-6 text-[18px]">
                WordPress is the world's most popular content management system (CMS), but not all providers are equal.
                We provide the power and security for a successful WordPress website while still giving you complete control to develop your website according to your specific needs easily and affordably.
                Regardless if you're an individual looking to set up a blog or a corporation wanting to sell online, the possibilities are endless with a WordPress site.
                Check out our <a href="/wordpress-hosting" className="text-blue-600 underline decoration-blue/40 hover:decoration-white">WordPress hosting packages</a> for even easier and faster WordPress hosting solution.
              </p>

              {/* Feature bullets */}
              <div className="mt-10 space-y-8">
                {/* 1-Click Management */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {/* inline SVG (click) */}
                    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.5 5.2c8.2 4.7 14.8 16 14.8 25.4 0 3.9-1.2 6.9-3.1 8.6-2.7 2.4-7.9 4.9-8 4.9.7-1.2 4.9-2.6 4.6-11C35.1 23.3 30 14.4 21.9 9 12.4 3.3 8.9 8.7 7.8 10.1c-.2-2.8 5.9-4.8 8.6-6.3 2.7-1.6 7-.9 11.1 1.4Z" fill="#FF9A3E" />
                      <path d="M21 8.5c8.2 4.7 14.8 16 14.8 25.4S29.2 47 21 42.3 6.2 26.3 6.2 16.9 12.8 3.8 21 8.5Z" fill="#FF7A00" />
                      <path d="M21 12.1c6.4 3.7 11.6 12.6 11.6 19.9S27.4 42.3 21 38.7 9.4 26.1 9.4 18.8 14.6 8.4 21 12.1Z" fill="#FFF" />
                      <path d="m16.8 19.5 3.8 6.6 8.6-5.7h1.9S20.7 31 20.7 31l-4.8-10.5 0 0Z" fill="#0049FF" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold">1-Click Management</h3>
                    <p className="text-[18px] mt-2">
                      Develop your existing WordPress site or create a new one in seconds with our builder and control panel.
                      Auto-apply updates, create backups, and restore with true 1-Click WordPress management.
                    </p>
                  </div>
                </div>

                {/* WordPress on LiteSpeed */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {/* inline SVG (LiteSpeed) */}
                    <Image
                      src="/images/features/wordpress_litespeed.svg"
                      alt="WordPress On LiteSpeed"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold">WordPress On LiteSpeed</h3>
                    <p className="text-[18px] mt-2">
                      Next-level WordPress optimization without touching code or hiring a developer.
                    </p>
                  </div>
                </div>

                {/* WordPress Made Safe */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {/* inline SVG (Made Safe) */}
                    <Image
                      src="/images/features/wordpress_save.svg"
                      alt="WordPress Made Safe"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold">WordPress Made Safe</h3>
                    <p className="text-[18px] mt-2">
                      Suspect someone got your <code>wp-admin</code>? Our AI-driven Security Shield blocks malicious logins,
                      patches known vulnerabilities, and keeps your site clean.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA */}
          <div className="mt-12 items-center text-center">
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-md bg-[#FF7A00] px-8 py-4 text-white font-semibold hover:bg-[#e56c00] transition"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* Powerful Cloud Hosting Solutions */}
      <section className="bg-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left content */}
            <div className="lg:pl-10">
              <h2 className="text-[40px] font-bold leading-tight">
                Powerful Cloud Hosting Solutions
              </h2>

              <p className="mt-6 text-[18px]">
                A fast website is key to online success. Our virtualized cloud hosting environment deploys your website on its own unique partition with specific system resources allocated and limits. This provides your own file system independent of the rest of the node, resulting in the high performance, supreme reliability, and security you deserve.
              </p>
            </div>
            {/* Left single image */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/wp-on-steroids/wp-illustration.svg"
                alt="WordPress Hosting Illustration"
                width={420}
                height={320}
                className="max-w-full h-auto"
              />
            </div>
          </div>
          {/* CTA */}
          <div className="mt-12 items-center text-center">
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-md bg-[#FF7A00] px-8 py-4 text-white font-semibold hover:bg-[#e56c00] transition"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* Detailed comparison table (DB-backed) */}
      <PlanComparison category="web" anchorId="web-comparison" />

      <FAQ
        items={faqs}
        heading="Web Hosting FAQs"
        subheading="Quick answers to common questions."
      />

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
