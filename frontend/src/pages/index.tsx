// src/pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import DomainSearchBox from 'components/DomainSearchBox';
import Testimonials from 'components/Testimonials';
import FaqSection from 'components/FaqSection';
import HostingPlanSelector from 'components/HostingPlanSelector';


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
            <Link
              href="/hosting"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started Now
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/hero-hosting.svg"
              alt="Web Hosting Illustration"
              className="max-w-md w-full"
            />
          </div>
        </div>
      </section>

      {/* Domain Search Section */}
      <DomainSearchBox />

      {/* Hosting Plans Section */}
      <h2 className="text-3xl font-bold text-center mb-10">Pilih Pelan Hosting Anda</h2>
      <div className="container mx-auto px-4 mb-10">
        <p className="text-center text-gray-600 mb-6">
          Pelan hosting kami bermula dari RM9.99/bulan. Pilih pelan yang sesuai untuk keperluan anda.
        </p>
      </div>
      {/* Hosting Plan Selector Component */}
      <HostingPlanSelector />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FaqSection />

    </>
  );
}
