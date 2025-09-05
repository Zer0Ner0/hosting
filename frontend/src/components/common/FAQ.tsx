import React, { memo, ReactNode, useMemo } from "react";

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

const ChevronIcon = memo(function ChevronIcon() {
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
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const FAQEntry = memo(function FAQEntry({
  item,
  index,
  defaultOpenIndex,
}: {
  item: FAQItem;
  index: number;
  defaultOpenIndex?: number | null;
}) {
  const id = useMemo(() => `faq-${slugify(item.q)}-${index}`, [item.q, index]);
  const open = defaultOpenIndex === index;
  return (
    <details
      className="group"
      aria-labelledby={`${id}-summary`}
      {...(open ? { open: true } : {})}
    >
      <summary
        id={`${id}-summary`}
        className="flex cursor-pointer list-none items-center justify-between px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <span className="text-left text-base font-medium">{item.q}</span>
        <ChevronIcon />
      </summary>
      <div className="px-5 pb-5 pt-0 text-sm text-current">{item.a}</div>
    </details>
  );
});

export default function FAQ({
  items,
  heading,
  subheading,
  ariaLabel,
  defaultOpenIndex = null,
}: FAQProps): JSX.Element {
  const sectionLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    if (heading) return heading;
    if (subheading) return subheading;
    return "Frequently Asked Questions";
  }, [ariaLabel, heading, subheading]);

  return (
    <section
      className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20"
      aria-label={sectionLabel}
    >
      {(heading || subheading) && (
        <header className="mb-8 text-center">
          {heading && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>}
          {subheading && <p className="mt-2 text-muted-foreground">{subheading}</p>}
        </header>
      )}

      {(!items || items.length === 0) ? (
          <p className="text-center text-sm text-white">No questions yet.</p>
      ) : (
        <div className="rounded-2xl shadow-sm" role="list">
          {items.map((item, idx) => (
            <div role="listitem" key={`${item.q}-${idx}`} className="contents">
              <FAQEntry item={item} index={idx} defaultOpenIndex={defaultOpenIndex ?? undefined} />
              {/* explicit divider between items */}
              {idx < items.length - 1 && (
                  <div aria-hidden="true" className="mx-5 h-px bg-white/50" />
                )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
