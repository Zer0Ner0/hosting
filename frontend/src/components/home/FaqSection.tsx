'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';

/** Single FAQ item */
export type FaqItem = {
  question: string;
  answer: string;
};

/** Props for the FaqSection component */
export type FaqSectionProps = {
  /** If not provided, uses the default list below */
  items?: FaqItem[];
  /** Optional section heading (H2) */
  heading?: string;
  /** Optional subheading (paragraph under H2) */
  subheading?: string;
  /** Open a specific item (index) on mount */
  defaultOpenIndex?: number | null;
  /** Accessible label when no heading/subheading is present */
  ariaLabel?: string;
};

/** Default content (Malay) if none is provided */
const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: 'Berapa lama untuk aktifkan hosting saya?',
    answer:
      'Hosting anda akan diaktifkan secara automatik dalam masa beberapa minit selepas pembayaran berjaya.',
  },
  {
    question: 'Adakah saya dapat domain percuma?',
    answer:
      'Ya, untuk pelan terpilih seperti Premium & WordPress Pro, anda akan mendapat domain percuma untuk tahun pertama.',
  },
  {
    question: 'Boleh tak saya upgrade pelan hosting kemudian?',
    answer:
      'Boleh. Anda boleh upgrade bila-bila masa tanpa gangguan kepada website anda.',
  },
  {
    question: 'Bagaimana kalau saya perlukan bantuan teknikal?',
    answer:
      'Kami sediakan support 24/7 melalui live chat dan tiket sokongan.',
  },
];

/** Chevron icon for accordion control */
const ChevronIcon = memo(function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

/** One FAQ row (bottom border only; last row hides border) */
const FaqRow = memo(function FaqRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  open: boolean;
  onToggle: (i: number) => void;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border-b border-gray-200 last:border-b-0" role="listitem">
      <button
        id={buttonId}
        type="button"
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={`Toggle jawapan untuk: ${item.question}`}
        onClick={() => onToggle(index)}
        className="
          flex w-full items-center justify-between gap-4 py-4 text-left
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          focus-visible:ring-emerald-800 focus-visible:ring-offset-white
        "
      >
        <span className="font-heading text-base font-medium text-neutral-900">
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Panel */}
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="pb-5 pr-10 text-sm font-sans text-neutral-900/80"
        >
          {item.answer}
        </div>
      )}
    </div>
  );
});

export default function FaqSection({
  items = DEFAULT_ITEMS,
  heading,
  subheading,
  defaultOpenIndex = null,
  ariaLabel,
}: FaqSectionProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? null : i));
  }, []);

  const sectionLabel = useMemo<string>(() => {
    if (ariaLabel) return ariaLabel;
    if (heading) return heading;
    if (subheading) return subheading;
    return 'Soalan Lazim';
  }, [ariaLabel, heading, subheading]);

  const hasHeader = Boolean(heading || subheading);
  const isEmpty = !items || items.length === 0;

  return (
    <section
      className="bg-white py-16"
      aria-label={sectionLabel}
    >
      <div className="container mx-auto max-w-3xl px-4">
        {hasHeader && (
          <header className="mb-8 text-center">
            {heading && (
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-2 font-sans text-neutral-900/70">{subheading}</p>
            )}
          </header>
        )}

        {isEmpty ? (
          <p className="text-center text-sm text-neutral-500">
            Tiada soalan buat masa ini.
          </p>
        ) : (
          <div className="rounded-2xl bg-white" role="list" aria-live="polite">
            {items.map((item, i) => (
              <FaqRow
                key={`${item.question}-${i}`}
                item={item}
                index={i}
                open={openIndex === i}
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
