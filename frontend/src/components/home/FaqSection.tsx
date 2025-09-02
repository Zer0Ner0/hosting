'use client';

import React, { memo, useMemo, useState } from 'react';

export type FaqItem = { question: string; answer: string };

export type FaqSectionProps = {
  /** If not provided, uses the default list below */
  items?: FaqItem[];
  heading?: string;
  subheading?: string;
  /** Open a specific item (index) on mount */
  defaultOpenIndex?: number | null;
  /** Accessible label when no heading/subheading is present */
  ariaLabel?: string;
};

const DEFAULT_ITEMS: FaqItem[] = [
  { question: 'Berapa lama untuk aktifkan hosting saya?', answer: 'Hosting anda akan diaktifkan secara automatik dalam masa beberapa minit selepas pembayaran berjaya.' },
  { question: 'Adakah saya dapat domain percuma?', answer: 'Ya, untuk pelan terpilih seperti Premium & WordPress Pro, anda akan mendapat domain percuma untuk tahun pertama.' },
  { question: 'Boleh tak saya upgrade pelan hosting kemudian?', answer: 'Boleh. Anda boleh upgrade bila-bila masa tanpa gangguan kepada website anda.' },
  { question: 'Bagaimana kalau saya perlukan bantuan teknikal?', answer: 'Kami sediakan support 24/7 melalui live chat dan tiket sokongan.' },
];

const Icon = memo(function Icon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
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

const FaqCard = memo(function FaqCard({
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
    <div className="overflow-hidden rounded-md border border-gray-200">
      <button
        id={buttonId}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => onToggle(index)}
        className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <span className="font-medium text-gray-800">{item.question}</span>
        <Icon open={open} />
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="border-t border-gray-100 bg-white px-5 py-4 text-gray-600"
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
  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  const sectionLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    if (heading) return heading;
    if (subheading) return subheading;
    return 'Soalan Lazim';
  }, [ariaLabel, heading, subheading]);

  const hasHeader = Boolean(heading || subheading);

  return (
    <section className="bg-white py-16" aria-label={sectionLabel}>
      <div className="container mx-auto max-w-2xl px-4">
        {hasHeader && (
          <header className="mb-6 text-center">
            {heading && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>}
            {subheading && <p className="mt-2 text-muted-foreground">{subheading}</p>}
          </header>
        )}

        {!items || items.length === 0 ? (
          <p className="text-center text-sm text-gray-500">Tiada soalan buat masa ini.</p>
        ) : (
          <div className="space-y-4" role="list">
            {items.map((item, i) => (
              <div role="listitem" key={`${item.question}-${i}`} className="contents">
                <FaqCard item={item} index={i} open={openIndex === i} onToggle={toggle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
