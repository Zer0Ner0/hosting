// frontend/src/components/web_builder/HowItWorks.tsx
const STEPS = [
    {
        step: 1,
        title: "Choose a template",
        desc: "Pick from business, portfolio, blog, e-commerce, or landing pages.",
    },
    {
        step: 2,
        title: "Customise sections",
        desc: "Edit text, images, colours, and layout with live preview.",
    },
    {
        step: 3,
        title: "Connect a domain",
        desc: "Use your Enom domain or search & buy a new one.",
    },
    {
        step: 4,
        title: "Publish",
        desc: "Deploy to fast hosting with SSL and CDN—automatically.",
    },
];

export default function HowItWorks() {
    return (
        <section
            aria-labelledby="how-it-works"
            className="bg-gray-50 border-y py-14 md:py-20"
        >
            <div className="container mx-auto px-4 md:px-6">
                <h2 id="how-it-works" className="text-2xl md:text-3xl font-semibold">
                    How it works
                </h2>
                <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((s) => (
                        <li key={s.step} className="rounded-2xl border bg-white p-6">
                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
                                {s.step}
                            </div>
                            <h3 className="mt-4 font-medium">{s.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
