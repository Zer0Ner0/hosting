import Head from 'next/head';
import Link from 'next/link';
import DomainSearchBox from '@/components/DomainSearchBox';
import HomepageHostingPlans from '@/components/HomepageHostingPlans';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>MyHosting - Affordable Web Hosting in Malaysia</title>
        <meta name="description" content="Get lightning-fast and reliable web hosting for your business. Starting from RM9.99/month." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Launch Your Website <span className="text-blue-600">with Ease</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Superfast hosting in Malaysia with free SSL, 24/7 support, and affordable plans.
            </p>
            <Link href="/hosting" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition">
              Get Started Now
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="/images/hero-hosting.svg" alt="Web Hosting Illustration" className="max-w-md w-full" />
          </div>
        </div>
      </section>

      {/* Domain Search */}
      <DomainSearchBox />

      {/* Web Hosting Plans + Billing Toggle */}
      <HomepageHostingPlans />

      {/* Social Proof */}
      <Testimonials />
      <FaqSection />
    </>
  );
}