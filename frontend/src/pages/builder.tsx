// frontend/src/pages/builder.tsx
import Head from "next/head";
import HeroBuilder from "@/components/web_builder/HeroBuilder";
import FeatureHighlights from "@/components/web_builder/FeatureHighlights";
import HowItWorks from "@/components/web_builder/HowItWorks";
import TemplateGrid from "@/components/web_builder/TemplateGrid";
import FaqSection from "@/components/FaqSection";

export default function BuilderPage() {
  return (
    <>
      <Head>
        <title>Website Builder – Fast, Beautiful, No-Code | Hosting</title>
        <meta
          name="description"
          content="Build a beautiful website in minutes. Pick a template, customise sections, connect a domain, and publish to fast hosting with SSL."
        />
      </Head>

      <main>
        <HeroBuilder />
        <FeatureHighlights />
        <HowItWorks />
        <TemplateGrid />
        <section className="container mx-auto px-4 md:px-6 pb-16">
          <FaqSection />
        </section>
      </main>
    </>
  );
}
