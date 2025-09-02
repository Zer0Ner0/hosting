import React, { memo, ReactNode, useMemo } from "react";

export type HighlightItem = {
  title: string;
  desc: string;
  icon?: ReactNode;
};

export type HighlightsStripProps = {
  items?: HighlightItem[];
  heading?: string;
  subheading?: string;
  /** Background style */
  variant?: "light" | "muted";
  /** Accessible label if no heading/subheading provided */
  ariaLabel?: string;
};

const DEFAULT_ITEMS: HighlightItem[] = [
  { title: "NVMe Storage", desc: "Superfast reads & writes for snappy sites." },
  { title: "LiteSpeed + LSCache", desc: "Next-gen web server with built-in caching." },
  { title: "Free SSL & Migrations", desc: "Secure by default; we’ll move you in." },
  { title: "24/7 Expert Support", desc: "Real humans when you need them." },
];

const Card = memo(function Card({ item }: { item: HighlightItem }) {
  return (
    <li className="rounded-2xl border bg-white p-5 shadow-sm" role="listitem">
      <div className="flex items-start gap-3">
        {item.icon && (
          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center text-blue-800" aria-hidden>
            {item.icon}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-blue-800">{item.title}</p>
          <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
        </div>
      </div>
    </li>
  );
});

export default function HighlightsStrip({
  items = DEFAULT_ITEMS,
  heading,
  subheading,
  variant = "light",
  ariaLabel,
}: HighlightsStripProps): JSX.Element {
  const sectionLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    if (heading) return heading;
    if (subheading) return subheading;
    return "Key highlights";
  }, [ariaLabel, heading, subheading]);

  const hasHeader = Boolean(heading || subheading);
  const background = variant === "light" ? "bg-blue-50" : "bg-slate-50";

  return (
    <section aria-label={sectionLabel} className={background}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {hasHeader && (
          <header className="mb-6 text-center">
            {heading && <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>}
            {subheading && <p className="mt-1 text-muted-foreground">{subheading}</p>}
          </header>
        )}
        {!items || items.length === 0 ? (
          <p className="text-center text-sm text-slate-500">Nothing to highlight yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {items.map((i, idx) => (
              <Card key={`${i.title}-${idx}`} item={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}