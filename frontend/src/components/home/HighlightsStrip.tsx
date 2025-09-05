import React, { memo, ReactNode } from "react";

export type HighlightItem = {
  title: string;
  desc: string;
  icon?: ReactNode;
};

export type HighlightsStripProps = {
  items?: HighlightItem[];
  heading?: string;
  subheading?: string;
  /** Background style aligned to brand neutrals */
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

/** Safe slug for aria-labelledby */
function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const Card = memo(function Card({ item }: { item: HighlightItem }): JSX.Element {
  return (
    <li
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      role="listitem"
    >
      <div className="flex items-start gap-3">
        {item.icon && (
          <span
            className="mt-0.5 inline-flex h-6 w-6 items-center justify-center text-[#166534]"
            aria-hidden="true"
          >
            {item.icon}
          </span>
        )}
        <div>
          <p className="font-sans text-sm font-semibold text-[#166534]">{item.title}</p>
          <p className="mt-1 font-sans text-sm text-neutral-700">{item.desc}</p>
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
  const hasHeader = Boolean(heading || subheading);
  const background =
    variant === "light" ? "bg-[#F9FAFB]" : "bg-white";

  const headingId = heading ? `highlights-${slugify(heading)}` : undefined;
  const sectionAria =
    ariaLabel || heading || subheading || "Key highlights";

  return (
    <section
      aria-label={!headingId ? sectionAria : undefined}
      aria-labelledby={headingId}
      className={background}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {hasHeader && (
          <header className="mb-6 text-center">
            {heading && (
              <h2
                id={headingId}
                className="font-heading text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-2 font-sans text-neutral-700">{subheading}</p>
            )}
          </header>
        )}

        {!items || items.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">
            Nothing to highlight yet.
          </p>
        ) : (
          <ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {items.map((i, idx) => (
              <Card key={`${i.title}-${idx}`} item={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
