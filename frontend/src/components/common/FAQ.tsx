import React, { ReactNode } from "react";

export type FAQItem = { q: string; a: ReactNode };

export type FAQProps = {
  /** Collapsible Q&A list */
  items: FAQItem[];
  heading?: string;
  subheading?: string;
  /** Accessible label fallback when no heading/subheading is provided */
  ariaLabel?: string;
  /** Optionally open a specific item by default (index) */
  defaultOpenIndex?: number | null;
};

function ChevronIcon(): JSX.Element {
  return (
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
  );
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function FAQEntry({
  item,
  index,
  defaultOpenIndex,
}: {
  item: FAQItem;
  index: number;
  defaultOpenIndex?: number | null;
}): JSX.Element {
  const id = `faq-${slugify(item.q)}-${index}`;
  const open = defaultOpenIndex === index;

  return (
    <li role="listitem" className="contents">
      <details
        className="group"
        aria-labelledby={`${id}-summary`}
        {...(open ? { open: true } : {})}
      >
        <summary
          id={`${id}-summary`}
          className="flex cursor-pointer items-center justify-between px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-[#14532d] focus-visible:ring-offset-2 focus-visible:ring-offset-white list-none [&::-webkit-details-marker]:hidden hover:bg-transparent active:bg-transparent"
        >
          <span className="text-left font-sans text-base font-medium text-neutral-900">
            {item.q}
          </span>
          <ChevronIcon />
        </summary>
        <div className="px-5 pb-5 pt-0 font-sans text-sm text-neutral-700">
          {item.a}
        </div>
      </details>
    </li>
  );
}

export default function FAQ({
  items,
  heading,
  subheading,
  ariaLabel,
  defaultOpenIndex = null,
}: FAQProps): JSX.Element {
  const sectionLabel = ariaLabel ?? heading ?? subheading ?? "Frequently Asked Questions";

  return (
    <section
      className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
      aria-label={sectionLabel}
    >
      {(heading || subheading) && (
        <header className="mb-8 text-center">
          {heading && (
            <h2 className="font-heading text-neutral-900 text-3xl font-semibold tracking-tight sm:text-4xl">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="font-sans mt-2 text-gray-600">{subheading}</p>
          )}
        </header>
      )}

      {!items || items.length === 0 ? (
        <p className="font-sans text-center text-sm text-gray-500">
          No questions yet.
        </p>
      ) : (
        <ul
          className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-200"
          role="list"
        >
          {items.map((item, idx) => (
            <FAQEntry
              key={`${item.q}-${idx}`}
              item={item}
              index={idx}
              defaultOpenIndex={defaultOpenIndex ?? undefined}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
