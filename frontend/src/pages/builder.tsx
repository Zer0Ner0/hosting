import Head from 'next/head';
import dynamic from 'next/dynamic';

const BuilderWizard = dynamic(() => import('@/components/builder/BuilderWizard'), { ssr: false });

export default function BuilderPage() {
  return (
    <>
      <Head>
        <title>Website Builder | AmirHost</title>
        <meta name="description" content="Assemble a landing page with drag-and-drop sections. Export HTML instantly." />
      </Head>
      <section className="container py-12">
        <h1 className="text-3xl font-bold">Website Builder</h1>
        <p className="mt-3 text-gray-600">Add sections, edit content, preview, and export as static HTML.</p>
        <div className="mt-6">
          <BuilderWizard />
        </div>
      </section>
    </>
  );
}
