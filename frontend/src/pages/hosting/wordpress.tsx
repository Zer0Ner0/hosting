'use client';
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import FAQ from "@/components/common/FAQ";
import TablePlans from "@/components/home/TablePlans";
import PlanComparison from "@/components/home/PlanComparison";
import Image from "next/image";
import Testimonials from "@/components/home/Testimonials";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Cell } from "recharts";

const speedData = [
  { feature: "LiteSpeed", value: 69618.5 },
  { feature: "Nginx", value: 6025.3 },
  { feature: "Apache", value: 826.5 },
];

const maxValue = Math.max(...speedData.map((d) => d.value));

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
      q: "Why should I choose WordPress for my site or content management system?",
      a: (
        <>
          <p className="p-4">
            There are several reasons why you should choose WordPress for your site or content
            management system, including:
          </p>
          <ul className="list-disc pl-8 p-4">
            <li>
              <b>1. User-Friendly:</b> WordPress is extremely user-friendly and easy to use, even
              for those with no technical experience. The platform offers a simple and intuitive
              interface that makes it easy to create and publish content.
            </li>
            <li>
              <b>2. Customizable:</b> With thousands of themes and plugins available, WordPress is
              highly customizable, allowing you to create a unique and professional-looking website
              that meets your specific needs.
            </li>
            <li>
              <b>3. SEO-Friendly:</b> WordPress is optimized for search engines, making it easier
              for your content to rank well in search results. The platform offers various plugins
              and tools that can help you optimize your content and improve your site's visibility
              in search engines.
            </li>
            <li>
              <b>4. Scalable:</b> WordPress is highly scalable, meaning it can grow with your
              business as your needs change. The platform can handle large volumes of content and
              traffic, making it suitable for businesses of all sizes.
            </li>
            <li>
              <b>5. Community Support:</b> WordPress has a large and active community of users and
              developers who are constantly creating new themes, plugins, and resources. This
              support means you can find solutions to almost any problem or question you may have.
            </li>
            <li>
              <b>6. Cost-Effective:</b> WordPress is open-source and free to use, with many free
              themes and plugins. Even premium themes and plugins are often more affordable than
              custom development.
            </li>
          </ul>
          <p className="p-4">
            Overall, WordPress is a versatile and powerful platform that offers a range of benefits
            for businesses of all sizes. Whether you're building a simple blog or a complex
            e-commerce site, WordPress can provide the tools and resources you need to create a
            successful online presence.
          </p>
        </>
      ),
    },
    {
      q: "Is WordPress good for an online store?",
      a: (
        <p className="p-4">
          Yes, WordPress is good for an online store. While WordPress is primarily known as a
          blogging platform and content management system, it has evolved over the years to become
          a robust e-commerce solution.
        </p>
      ),
    },
    {
      q: "How do I install WordPress after purchasing web hosting?",
      a: (
        <p className="p-4">
          Once your payment has been completed, your WordPress hosting account is made available
          instantly. Login to our control panel inside our client portal, then use our one-click
          automatic WordPress installation and fill out some basic information about your website.
          This is all completed in your web browser without needing FTP programs or coding. No
          technical experience is required; just point and click!
        </p>
      ),
    },
    {
      q: "How do I claim a free domain after purchasing WordPress hosting with NameHero?",
      a: (
        <p className="p-4">
          To claim your free domain you must select our Turbo or Business Cloud package paid 24 or
          36 months. During signup you'll be given the opportunity to register a new domain or
          transfer your existing domain for free. Eligible TLDs: .com, .net, .org, .mobi, .us,
          .biz, .co.uk. If undecided, you can open a billing ticket within 30 days of your account
          to claim this special offer. Domains renew at their regular rate after 1 year.
        </p>
      ),
    },
    {
      q: "What's the difference between managed WordPress and shared WordPress hosting?",
      a: (
        <>
          <p className="p-4">
            Managed WordPress hosting and shared WordPress hosting are two different types of web
            hosting services tailored to different needs:
          </p>
          <ul className="list-disc pl-8 p-4">
            <li>
              <b>1. Server Resources:</b> Shared hosting hosts multiple websites on the same server,
              sharing CPU, RAM, and disk space. Managed hosting isolates websites with dedicated
              resources using private cloud and CageFS.
            </li>
            <li>
              <b>2. Performance:</b> Shared hosting performance can be affected by others on the
              same server. Managed hosting offers faster performance with dedicated resources.
            </li>
            <li>
              <b>3. Management:</b> Shared hosting requires you to manage your website. Managed
              hosting includes provider-managed updates, patches, and backups.
            </li>
            <li>
              <b>4. Security:</b> Shared hosting is less secure due to shared resources. Managed
              hosting provides firewalls, malware scanning, and regular backups.
            </li>
            <li>
              <b>5. Cost:</b> Shared hosting is cheaper and good for small sites. Managed hosting is
              more expensive but better for larger, high-traffic websites.
            </li>
          </ul>
          <p className="p-4">
            The choice depends on your website's needs and budget. Small, low-traffic sites can use
            shared hosting, while larger, higher-traffic sites benefit from managed hosting.
          </p>
        </>
      ),
    },
    {
      q: "Can I host multiple WordPress sites with NameHero?",
      a: (
        <p className="p-4">
          Each of our managed WordPress hosting packages allows for a specific number of websites:
          Starter Cloud: 1, Plus Cloud: 7, Turbo Cloud: Unlimited, Business Cloud: Unlimited. Most
          new customers choose Turbo Cloud for flexibility, while existing WordPress site owners
          often choose Business Cloud for better performance and future growth.
        </p>
      ),
    },
    {
      q: "Does NameHero have its own data center?",
      a: (
        <p className="p-4">
          Yes, NameHero operates two wholly owned data centers in Lenexa, Kansas to deliver unmatched
          stability, security features, and WordPress performance. Our private cloud is built with
          mission-critical hardware including AMD EPYC CPUs, DDR4 memory, and NVMe storage. Using our
          hybrid cloud model and content delivery networks, we deliver global scalability with ease.
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
                  WordPress Hosting Made Easy
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-base/7 text-white/90">
                  Hosting Malaysia offers best-in-class WordPress hosting plans and 24/7/365 support
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip directly under hero */}
      {/* <TrustBar />

      <BenefitsStrip items={benefits} /> */}

      <section id="packages" aria-label="Popular plans" className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#000000] font-['DM_Sans']">
            Choose Your WordPress Hosting Plan
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[#727586] font-['DM_Sans']">
            Choose a plan and scale when you grow.
          </p>
          <div className="mt-auto">
            <TablePlans fixedCategory="wordpress" />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-blue-900" aria-labelledby="why-choose-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <h2 id="why-choose-heading" className="text-[40px] font-extrabold text-center text-white leading-tight">
            Why Choose NameHero For WordPress Hosting
          </h2>

          {/* Subheader */}
          <p className="mt-4 text-[20px] text-center text-white">
            Quickly launch your web hosting account with lightning-fast WordPress hosting
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left text block */}
            <div className="space-y-6 text-white text-justify">
              <p className="text-[18px] leading-relaxed">
                Hosting Malaysia offers a catered web hosting service to WordPress users that makes it easy to get up and running quick. Register your free domain with our Turbo or Business Cloud package and have WordPress installed automatically.
              </p>
              <p className="text-[18px] leading-relaxed">
                We also offer speeds that you can't find at other WordPress hosting providers with our cutting edge equipment and out-of-the-box software. Many regular hosting providers try to overload server resources to make their investors happy. At Hosting Malaysia, you get more speed and space at a fraction of the cost.
              </p>
              <p className="text-[18px] leading-relaxed">
                Our WordPress experts know website speed and 24/7/365 support are a winning combination for your WordPress website. Every WordPress package is bolstered with LiteSpeed and additional features to give you a competitive edge amongst in your industry.
              </p>
            </div>

            {/* Right image */}
            <div className="flex justify-center md:justify-center">
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
      <section className="bg-white" aria-labelledby="why-choose-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <h2 id="why-choose-heading" className="text-[40px] font-extrabold text-center text-black leading-tight">
            Blazing Fast WordPress Hosting Services
          </h2>

          {/* Subheader */}
          <p className="mt-4 text-[20px] text-center text-gray-600">
            Looking for a WordPress hosting service that delivers lightning-fast speed and performance? Look no further than Hosting Malaysia
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left bar chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-80 max-w-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speedData} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fontSize: 12 }} width={120} />
                    <Bar
                      dataKey="value"
                      radius={[0, 6, 6, 0]}
                      // Custom color: orange if max, else gray
                      fillOpacity={1}
                    >
                      <LabelList dataKey="value" position="right" className="fill-gray-800 text-sm" />
                      {
                        speedData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.value === maxValue ? "#1e3a8a" : "#D1D5DB"} // gray-300 for others
                          />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-2 ml-[120px] max-w-[calc(100%-120px)]">
                <p className="text-sm text-gray-500 text-center">
                  Request Per Second (100 Users)
                </p>
              </div>
            </div>

            {/* Left text block */}
            <div className="space-y-6 text-gray-600 text-justify">
              <p className="text-[18px] leading-relaxed">
                Our private cloud hosting service is optimized for high performance, featuring cutting-edge technology like AMD EPYC CPUs and NVMe storage for lightning-fast processing and data access.
              </p>
              <p className="text-[18px] leading-relaxed">
                With our free LiteSpeed caching plugin, you can easily and quickly accelerate your WordPress site with just one click. Plus, our multiple PHP version control and virtualized file systems provide ultimate flexibility and control over your site's performance.
              </p>
              <p className="text-[18px] leading-relaxed">
                We also offer highly available server resources with redundant 20gbp/s uplinks, ensuring that your site stays online and accessible to your users at all times.
              </p>
              <p className="text-[18px] leading-relaxed">
                Whether you're looking to improve user experience or boost your SEO rankings, Hosting Malaysia's private cloud and powerful caching engine can help take your WordPress site to the next level. Ready to customize your hosting experience?
              </p>
            </div>
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
              <h3 className="text-lg text-center font-semibold text-[20px]">LiteSpeed Caching, One Click Quick Cloud Acceleration</h3>
            </div>

            {/* Complete Control */}
            <div className="flex flex-col items-center text-left">
              <div className="mb-4">
                <Image
                  src="/images/features/cpu.svg"
                  alt="Complete Control"
                  width={60}
                  height={60}
                  className="h-24 w-24"
                />
              </div>
              <h3 className="text-lg text-center font-semibold text-[20px]">High Performing AMD EPYC CPUs With NVMe Storage</h3>
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
              <h3 className="text-lg text-center font-semibold text-[20px]">Multiple PHP Version Control With WP-CLI & Virtualized File Systems</h3>
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
              <h3 className="text-lg text-center font-semibold text-[20px]">Highly Available Server Resources With Redundant 20gbp/s Uplinks</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-blue-900 text-white" aria-labelledby="security-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <h2 id="security-heading" className="text-[40px] font-extrabold text-center md:text-center text-white leading-tight md:col-span-2">
            Insanely Secure WordPress Hosting Service
          </h2>
          {/* Left side: Feature boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-blue-700 rounded-lg p-6 bg-blue-800/30">
              <div className="mb-4 flex justify-center">
                <img src="/images/icons/ssl.svg" alt="Free SSL" className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold">Free and Automatic SSL Certificates</h3>
              <p className="mt-2 text-sm text-gray-100">With Let's Encrypt SSL</p>
            </div>

            <div className="border border-blue-700 rounded-lg p-6 bg-blue-800/30">
              <div className="mb-4 flex justify-center">
                <img src="/images/icons/ddos.svg" alt="DDOS Protection" className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold">Always-on DDOS Protection</h3>
              <p className="mt-2 text-sm text-gray-100">With individual WordPress site inspection</p>
            </div>

            <div className="border border-blue-700 rounded-lg p-6 bg-blue-800/30">
              <div className="mb-4 flex justify-center">
                <img src="/images/icons/firewall.svg" alt="AI Firewall" className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold">Mitigate Security Threats</h3>
              <p className="mt-2 text-sm text-gray-100">AI-powered Web Application Firewall</p>
            </div>

            <div className="border border-blue-700 rounded-lg p-6 bg-blue-800/30">
              <div className="mb-4 flex justify-center">
                <img src="/images/icons/backup.svg" alt="Backups" className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold">On-demand Backups</h3>
              <p className="mt-2 text-sm text-gray-100">With SSH access & git integration</p>
            </div>
          </div>

          {/* Right side: Description */}
          <div>
            <p className="mb-4 text-gray-100">
              With Hosting Malaysia’s exclusive Security Shield, your WordPress website will run always on DDOS protection,
              that uses individual packet detection to ensure the integrity of your traffic. This patented technology is
              traditionally used in government/military grade systems, but Hosting Malaysia is the only shared hosting provider
              to make this feature available at no additional charge.
            </p>
            <p className="mb-4 text-gray-100">
              In addition, our WordPress web application firewall harnesses the power of artificial intelligence to learn of
              new threats in real time, providing instant mitigation to the newest attacks including real-time virus/malware scanning.
            </p>
            <p className="mb-6 text-gray-100">
              Our private cloud provides unmatched uptime backed by fully redundant hypervisors in our wholly owned data
              center. This provides 99.9% uptime and mission-critical fault tolerance.
            </p>
            <div className="flex justify-center">
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

      {/* Benefits of Managed WP Hosting */}
      <section className="bg-white" aria-labelledby="benefits-managed-wp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="benefits-managed-wp" className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Benefits of Managed WordPress Hosting
              </h2>
              <p className="mt-6 text-slate-600">
                Need a little help running the day-to-day with your WordPress site? Our managed hosting covers all
                aspects of security features and updates, ensures 99.9% uptime and frequent backups—so you can sleep
                soundly knowing your website can weather any storm.
              </p>
              <p className="mt-4 text-slate-600">
                If you manage multiple sites, managed WordPress hosting delivers unmatched ROI for your time and money.
                Focus on building your business and content—let Hosting Malaysia keep your site fast, reliable, and secure.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/wp/benefits-illustration-1.svg"
                alt="Managed WordPress hosting benefits illustration"
                width={520}
                height={360}
                className="h-auto w-full max-w-[520px]"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex justify-center md:justify-start">
              <Image
                src="/images/wp/benefits-illustration-2.svg"
                alt="Automatic updates and installation illustration"
                width={520}
                height={360}
                className="h-auto w-full max-w-[520px]"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Automatic WordPress Updates & Installation
              </h3>
              <p className="mt-6 text-slate-600">
                Our automatic WordPress updates keep your themes, plugins, and core files running at peak performance
                without manual checks.
              </p>
              <p className="mt-4 text-slate-600">
                Deploy new sites in a couple of clicks, stage changes safely, and manage every aspect from your browser—
                no coding required. WP-CLI is included across our hosting services for power users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed comparison table (DB-backed) */}
      <PlanComparison category="basic" anchorId="web-comparison" />

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
