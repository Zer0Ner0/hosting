import { ReactNode } from "react";

type Item = {
  title: string;
  desc?: string;
  icon?: ReactNode; // optional custom icon
};

type Props = {
  items: Item[];
  heading?: string;
  subheading?: string;
};

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M20.285 6.708a1 1 0 0 1 .007 1.414l-9 9a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L10.5 14.5l8.293-8.293a1 1 0 0 1 1.492.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function BenefitsStrip({ items, heading, subheading }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {(heading || subheading) && (
        <header className="mb-6 text-center">
          {heading && <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>}
          {subheading && <p className="mt-1 text-muted-foreground">{subheading}</p>}
        </header>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-2xl border bg-white/80 p-4 shadow-sm"
          >
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white">
              {it.icon ?? <DefaultIcon />}
            </span>
            <div>
              <div className="font-medium">{it.title}</div>
              {it.desc && <div className="text-sm text-gray-600">{it.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
