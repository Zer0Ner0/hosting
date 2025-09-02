import React, { memo } from 'react'

type Rating = 1 | 2 | 3 | 4 | 5
interface Testimonial {
  name: string
  role: string
  rating: Rating
  quote: string
}

const DEFAULT_TESTIMONIALS: ReadonlyArray<Testimonial> = [
  { name: 'Ahmad Zulkifli', role: 'Small Business Owner, Johor', rating: 5,
    quote: 'Saya sangat puas hati dengan servis MyHosting. Mudah, cepat dan harga pun berpatutan!' },
  { name: 'Nurul Izzah', role: 'Freelance Web Designer, Penang', rating: 5,
    quote: 'Support 24 jam memang terbaik. Sangat sesuai untuk client saya yang perlukan hosting segera.' },
  { name: 'Jason Lim', role: 'eCommerce Founder, KL', rating: 4,
    quote: 'Saya suka interface yang senang guna. Domain & hosting semua settle dalam masa sejam!' },
] as const

interface StarRatingProps {
  rating: Rating
}
const StarRating = memo(function StarRating({ rating }: StarRatingProps): React.ReactElement {
  // Decorative stars with an accessible label
  return (
    <div className="flex justify-center mb-3" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`text-xl ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            {filled ? '★' : '☆'}
          </span>
        )
      })}
    </div>
  )
})

interface CardProps {
  t: Testimonial
}
const TestimonialCard = memo(function TestimonialCard({ t }: CardProps): React.ReactElement {
  return (
    <figure className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-left md:text-center">
      <StarRating rating={t.rating} />
      <blockquote className="mb-4">
        <p className="italic text-gray-700">“{t.quote}”</p>
      </blockquote>
      <figcaption className="md:flex md:flex-col md:items-center">
        <h4 className="font-semibold text-gray-900">{t.name}</h4>
        <p className="text-sm text-gray-500">{t.role}</p>
      </figcaption>
    </figure>
  )
})

interface Props {
  /** Optional override to supply testimonials from CMS/API */
  items?: ReadonlyArray<Testimonial>
  /** Optional override for the section heading */
  heading?: string
}

export default function Testimonials({
  items = DEFAULT_TESTIMONIALS,
  heading = 'Trusted by Hundreds of Malaysians',
}: Props): React.ReactElement {
  const hasItems = items.length > 0

  return (
    <section className="py-16" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="testimonials-heading" className="text-3xl font-bold mb-10 text-white">
          {heading}
        </h2>

        {!hasItems ? (
          <p className="text-gray-200">No testimonials yet.</p>
        ) : (
          <ul role="list" className="grid md:grid-cols-3 gap-8">
            {items.map((t) => (
              <li role="listitem" key={`${t.name}-${t.role}`}>
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}