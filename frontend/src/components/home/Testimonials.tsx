import React, { memo } from 'react';

/* ===========================
   Types
=========================== */
export type Rating = 1 | 2 | 3 | 4 | 5;

export type Testimonial = {
  name: string;
  role: string;
  rating: Rating;
  quote: string;
};

export type TestimonialsProps = {
  /** Optional override to supply testimonials from CMS/API */
  items?: ReadonlyArray<Testimonial>;
  /** Section heading (H2) */
  heading?: string;
  /** Optional copy under heading */
  subheading?: string;
  /** Accessible label when no heading/subheading is present */
  ariaLabel?: string;
};

/* ===========================
   Defaults
=========================== */
const DEFAULT_TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    name: 'Ahmad Zulkifli',
    role: 'Small Business Owner, Johor',
    rating: 5,
    quote:
      'Saya sangat puas hati dengan servis MyHosting. Mudah, cepat dan harga pun berpatutan!',
  },
  {
    name: 'Nurul Izzah',
    role: 'Freelance Web Designer, Penang',
    rating: 5,
    quote:
      'Support 24 jam memang terbaik. Sangat sesuai untuk client saya yang perlukan hosting segera.',
  },
  {
    name: 'Jason Lim',
    role: 'eCommerce Founder, KL',
    rating: 4,
    quote:
      'Saya suka interface yang senang guna. Domain & hosting semua settle dalam masa sejam!',
  },
] as const;

/* ===========================
   Subcomponents
=========================== */
const StarRating = memo(function StarRating({
  rating,
}: {
  rating: Rating;
}): JSX.Element {
  // Decorative stars with a readable label
  return (
    <div className="flex justify-center md:justify-start" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`text-base sm:text-lg ${filled ? 'text-[#FACC15]' : 'text-gray-300'}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
});

const TestimonialCard = memo(function TestimonialCard({
  t,
}: {
  t: Testimonial;
}): JSX.Element {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <StarRating rating={t.rating} />
        <blockquote className="mt-3">
          <p className="font-sans italic leading-relaxed text-neutral-800">“{t.quote}”</p>
        </blockquote>
      </div>
      <figcaption className="mt-6">
        <p className="font-heading text-base font-semibold text-neutral-900">{t.name}</p>
        <p className="font-sans text-sm text-neutral-600">{t.role}</p>
      </figcaption>
    </figure>
  );
});

/* ===========================
   Component
=========================== */
export default function Testimonials({
  items = DEFAULT_TESTIMONIALS,
  heading = 'Apa kata pelanggan kami',
  subheading,
  ariaLabel,
}: TestimonialsProps): JSX.Element {
  const hasItems = items && items.length > 0;
  const headingId = 'testimonials-heading';
  const sectionAria = ariaLabel || heading || 'Testimonials';

  return (
    <section
      className="bg-[#F9FAFB] py-16"
      aria-labelledby={heading ? headingId : undefined}
      aria-label={!heading ? sectionAria : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <header className="mb-10 text-center">
            {heading && (
              <h2
                id={headingId}
                className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-2 font-sans text-neutral-700">{subheading}</p>
            )}
          </header>
        )}

        {!hasItems ? (
          <p className="text-center font-sans text-sm text-neutral-500">
            No testimonials yet.
          </p>
        ) : (
          <ul
            role="list"
            aria-live="polite"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((t, idx) => (
              <li key={`${t.name}-${idx}`} role="listitem" className="h-full">
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
