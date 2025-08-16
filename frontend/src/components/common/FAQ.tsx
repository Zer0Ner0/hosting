import { ReactNode } from "react";

export type FAQItem = { q: string; a: ReactNode };

type Props = {
  items: FAQItem[];
  heading?: string;
  subheading?: string;
};

export default function FAQ({ items, heading, subheading }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {(heading || subheading) && (
        <header className="mb-8 text-center">
          {heading && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>}
          {subheading && <p className="mt-2 text-muted-foreground">{subheading}</p>}
        </header>
      )}

      <div className="divide-y rounded-2xl border shadow-sm">
        {items.map((item, idx) => (
          <details key={idx} className="group" aria-label={`FAQ item ${idx + 1}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
              <span className="text-left text-base font-medium">{item.q}</span>
              <svg
                className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm text-gray-600">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
