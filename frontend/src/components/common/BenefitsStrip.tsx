import React, { memo, ReactNode, useMemo } from "react";

export type BenefitItem = {
  title: string;
  desc?: string;
  icon?: ReactNode; // optional custom icon
};

export type BenefitsStripProps = {
  /** Cards to render — pass 4 for a clean 1×4 layout on desktop */
  items: BenefitItem[];
  heading?: string;
  subheading?: string;
  /** Override the accessible label of the section (falls back to heading/subheading) */
  ariaLabel?: string;
};

const DefaultIcon = memo(function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M20.285 6.708a1 1 0 0 1 .007 1.414l-9 9a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L10.5 14.5l8.293-8.293a1 1 0 0 1 1.492.5Z"
        fill="currentColor"
      />
    </svg>
  );
});

const BenefitCard = memo(function BenefitCard({
  item,
  headingId,
}: {
  item: BenefitItem;
  headingId?: string;
}) {
  return (
    <li
      className="flex items-start gap-3 rounded-2xl border bg-white/80 p-4 shadow-sm"
      aria-labelledby={headingId}
    >
      <span
        className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white"
        aria-hidden="true"
      >
        {item.icon ?? <DefaultIcon />}
      </span>
      <div>
        {/* The title acts as the card label for screen readers */}
        <div id={headingId} className="font-medium">
          {item.title}
        </div>
        {item.desc && <p className="text-sm text-gray-600">{item.desc}</p>}
      </div>
    </li>
  );
});

export default function BenefitsStrip({
  items,
  heading,
  subheading,
  ariaLabel,
}: BenefitsStripProps): JSX.Element {
  const sectionLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    if (heading) return heading;
    if (subheading) return subheading;
    return "Benefits";
  }, [ariaLabel, heading, subheading]);

  const hasHeader = Boolean(heading || subheading);

  if (!items || items.length === 0) {
    // Graceful empty state (keeps spacing consistent in layouts)
    return (
      <section
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        aria-label={sectionLabel}
      >
        {hasHeader && (
          <header className="mb-6 text-center">
            {heading && (
              <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>
            )}
            {subheading && (
              <p className="mt-1 text-muted-foreground">{subheading}</p>
            )}
          </header>
        )}
        <p className="text-center text-sm text-gray-500">No benefits to show yet.</p>
      </section>
    );
  }
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-label={sectionLabel}
    >
      {hasHeader && (
        <header className="mb-6 text-center">
          {heading && (
            <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>
          )}
          {subheading && (
            <p className="mt-1 text-muted-foreground">{subheading}</p>
          )}
        </header>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {items.map((it, idx) => {
          const id = `benefit-${(it.title || "item").toLowerCase().replace(/\s+/g, "-")}-${idx}`;
          return <BenefitCard key={id} item={it} headingId={id} />;
        })}
      </ul>
    </section>
  );
}
