'use client';
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import TablePlans from "@/components/home/TablePlans";
import PlanComparison from "@/components/home/PlanComparison";
import Image from "next/image";
import Testimonials from "@/components/home/Testimonials";

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

  interface FAQItem {
    q: string;
    a: ReactNode;
  }
  const faqs: FAQItem[] = [
    {
      q: "What is website hosting?",
      a: (
        <p className="p-4">
          Web hosting is a service is a company that hosts and stores a website to make it available on the Internet. Web hosting allows you to publish your website online by providing the infrastructure and technology needed for a site to be accessed online. A web host gives website owners storage space for their site and a range of other features, often including a free domain and a website builder, as we do at NameHero.
        </p>
      ),
    },
    {
      q: "What is a web hosting package?",
      a: (
        <p className="p-4">
          A hosting plan is a package of features that you can select for the hosting of your website. Hosting plans vary in price, features, storage, and how many websites they can host. If you need web hosting for multiple sites, for example, you would need to choose a hosting plan that offers this feature. Web hosting providers typically offer a range of packages for you to choose from, including features like dedicated hosting, WordPress hosting, and even a free domain.
        </p>
      ),
    },
    {
      q: "What is shared and dedicated hosting?",
      a: (
        <p className="p-4">
          Shared hosting and dedicated hosting are two different types of web hosting services offered by providers. Shared hosting is when multiple websites share a single server and its resources, including CPU, RAM, and storage space. Dedicated hosting is when a website is hosted on a dedicated server only used by one client—you’ll have your own server that you can manage. The choice between a dedicated server or a single server depends on the specific needs of your business and your budget.
        </p>
      ),
    },
    {
      q: "What is WordPress hosting?",
      a: (
        <p className="p-4">
          WordPress hosting is a type of web hosting specifically designed for hosting a WordPress website. This type of web hosting usually includes WordPress software, automatic updates, and caching technology. This is a great option for people who want to create and manage WordPress websites without having to worry about technical aspects such as security and configuration.
        </p>
      ),
    },
    {
      q: "What is a virtual private server?",
      a: (
        <p className="p-4">
          A virtual private server (VPS) is a type of web hosting that provides a virtualized environment on a shared physical server. As a result, multiple VPS instances can run on a single server, with each VPS having an operating system, CPU, and memory.
        </p>
      ),
    },
    {
      q: "What is VPS hosting?",
      a: (
        <p className="p-4">
          VPS hosting is when a website is hosted on a virtualized server on a shared physical server. Providers usually offer VPS hosting plans that give clients flexibility and control over dedicated hosting.
        </p>
      ),
    },
    {
      q: "What are dedicated servers?",
      a: (
        <p className="p-4">
          A dedicated server is a type of web hosting that includes a client leasing an entire physical server that is only meant to host their specific website. Clients are in complete control when they select dedicated hosting, including being able to customize the server settings and manage security.
        </p>
      ),
    },
    {
      q: "What is email hosting?",
      a: (
        <p className="p-4">
          Email hosting is a type of web hosting designed specifically for hosting email accounts. This type of web hosting includes email storage, spam filtering, backups, and security features.
        </p>
      ),
    },
    {
      q: "What is a website builder?",
      a: (
        <p className="p-4">
          A website builder is a tool, often provided by a hosting service, that allows clients to create a website from scratch. Many hosting companies include access to a website builder in their hosting plans.
        </p>
      ),
    },
    {
      q: "What is cPanel?",
      a: (
        <p className="p-4">
          cPanel is a popular web hosting control panel for managing a hosting account. At NameHero, we put our clients in the driver’s seat with a control panel that allows you to manage your account quickly and easily.
        </p>
      ),
    },
    {
      q: "What Is LiteSpeed Web Server?",
      a: (
        <p className="p-4">
          LiteSpeed web server (LSWS) is a high-performance Apache drop-in replacement. LSWS is the fourth most popular server on the internet and the number one choice in commercial environments. Performance can be up to 20 times faster than Apache, with a small memory footprint and increased scalability.
        </p>
      ),
    },
    {
      q: "What Is MariaDB?",
      a: (
        <p className="p-4">
          MariaDB is a drop-in replacement for MySQL data, following the same schemas and structure. It is compatible with your current scripts and software that require mySQL. The difference is faster and safer data replication.
        </p>
      ),
    },
    {
      q: "What uptime guarantee do you provide?",
      a: (
        <p className="p-4">
          We proudly provide a 99.9% website uptime guarantee (not network or server, however).{" "}
          <a href="/uptime" className="underline">View The Facts</a>.
        </p>
      ),
    },
    {
      q: "Where are your servers located?",
      a: (
        <p className="p-4">
          Our servers are located in Lansing, Michigan, USA and Lenexa, Kansas, USA. Test the speed{" "}
          <b>
            <a
              href="https://kcdc-speedtest.namehero.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Test the speed here - open in a new tab"
              className="underline"
            >
              here
            </a>
          </b>.
        </p>
      ),
    },
    {
      q: "What are my limits per cPanel?",
      a: (
        <ul className="p-4 list-disc pl-8">
          <li><b>Disk Space:</b> Unlimited Storage</li>
          <li><b>Bandwidth:</b> Unmetered Bandwidth</li>
          <li><b>Physical Memory:</b> Allocated per package (see comparison table)</li>
          <li><b>Concurrent Connections:</b> 50</li>
          <li><b>Number of Processes:</b> 100</li>
          <li><b>I/O Limit:</b> 8MB/s</li>
          <li><b>I/O operations per second:</b> 1024</li>
          <li><b>Inodes:</b> Allocated per package (see comparison table)</li>
        </ul>
      ),
    },
    {
      q: "What is unmetered bandwidth?",
      a: (
        <p className="p-4">
          When hosting providers include unmetered bandwidth in their packages, they sell unlimited bandwidth or data transfer to their clients. Having unmetered bandwidth means there are no caps or limits on how much data a website can transfer each month without additional costs.
        </p>
      ),
    },
    {
      q: "What happens if I need more limits per cPanel?",
      a: (
        <p className="p-4">
          We handle this on a case-by-case basis. Sometimes we can upgrade your current package and move to a Managed VPS or Cloud Dedicated Server (we move all the data, you just have to pay the package difference). Scaling with NameHero is easy!
        </p>
      ),
    },
    {
      q: "Can you transfer my existing websites from my previous web host?",
      a: (
        <p className="p-4">
          We'll transfer your website for free within the first 30 days. If you require transfers outside of this time frame, we will either charge you a fee or provide you with resources to do this yourself.
        </p>
      ),
    },
    {
      q: "Do you allow adult content?",
      a: (
        <p className="p-4">
          No. We do not allow content that could be considered adult in nature on any package at NameHero.
        </p>
      ),
    },
    {
      q: "Do you provide SSH access?",
      a: (
        <p className="p-4">
          Yes, we can provide "Jailshelled" SSH access on all our accounts. To enable this on your account, please open a new support ticket, and our team of SuperHeroes will provide further instructions.
        </p>
      ),
    },
  ];

  interface BenefitItem {
    title: string;
    desc: string;
  }
  const benefits: BenefitItem[] = [
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

      {/* HERO — NameHero-style with background image (fluid 1792:728) */}
      <section className="relative overflow-hidden bg-white" aria-label="Hero: Fast hosting and domains">
        <div className="mx-auto w-full max-w-[1920px]">
          {/* Aspect-ratio wrapper */}
          <div className="relative aspect-[1792/728] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
            {/* background image */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero-section.svg"
                alt="Fast NVMe Web Hosting"
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* content */}
            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center text-center">
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Award Winning Web Hosting In Just A Few Clicks
                </h1>
                <p className="mx-auto mt-3 max-w-4xl text-base/7 text-white/90">
                  <ul role="list" className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-lg opacity-90 max-w-4xl">
                    <li className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">✓</span>
                      <span><strong>Blazing Fast</strong> Website Speed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">✓</span>
                      <span><strong>Easy To Use,</strong> Guru-Free Platform</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">✓</span>
                      <span><strong>Reliable Hosting</strong> That Scales</span>
                    </li>
                  </ul>
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="#packages"
                    className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-0"
                    aria-label="Browse hosting plans"
                  >
                    Get Started Now
                  </a>
                </div>
                <p className="mt-6 text-sm text-white/80">
                  Proudly trusted by over <span className="font-semibold text-white">40,000+</span> customers and{" "}
                  <span className="font-semibold text-white">750,000+</span> websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip directly under hero */}
      <TrustBar />

      <BenefitsStrip items={benefits} />

      <section id="packages" aria-label="Popular plans" className="bg-white">
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
      <section className="bg-white" aria-label="Key feature highlights">
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
      <section className="bg-blue-900" aria-labelledby="why-choose-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <h2 id="why-choose-heading" className="text-[40px] font-extrabold text-center text-white leading-tight">
            Why Choose YourBrand as Your Web Hosting Service Provider
          </h2>

          {/* Subheader */}
          <p className="mt-4 text-[20px] text-center text-white">
            Did you know that poor loading speeds are one of the main reasons
            visitors leave websites before viewing them?
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left text block */}
            <div className="space-y-6 text-white text-justify">
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
      <section aria-label="Managed WordPress Hosting">
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
      <section className="bg-blue-900 text-white" aria-label="Powerful cloud hosting">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
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

      {/* SOCIAL PROOF */}
      <section className="bg-blue-900" aria-label="Customer testimonials">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>



      {/* FAQ — blue section */}
      <section
        id="faqs"
        aria-labelledby="faqs-heading"
        className="text-black"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 [&_*]:text-black">
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
