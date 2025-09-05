// frontend/src/components/home/TrustBar.tsx

import React from 'react'
import Image from 'next/image'

/**
 * Brand logo item for the TrustBar.
 */
export interface Brand {
  src: string
  alt: string
}

/**
 * Default brand set shown when no items are provided.
 * Uses SVGs placed in /public/images/brands.
 */
export const BRANDS: ReadonlyArray<Brand> = [
  { src: '/images/brands/cpanel.svg', alt: 'cPanel' },
  { src: '/images/brands/litespeed.svg', alt: 'LiteSpeed' },
  { src: '/images/brands/cloudlinux.svg', alt: 'CloudLinux' },
  { src: '/images/brands/imunify.svg', alt: 'Imunify360' },
  { src: '/images/brands/wordpress.svg', alt: 'WordPress' },
] as const

export interface TrustBarProps {
  /** Override the default list of brand logos */
  readonly items?: ReadonlyArray<Brand>
  /** Accessible label for the section heading (visually hidden) */
  readonly heading?: string
  /** Optional className passthrough for outer section */
  readonly className?: string
  /** Reduce visual prominence (adds opacity) */
  readonly muted?: boolean
  /**
   * Provide a unique id for the heading to avoid duplicate ids
   * when rendering multiple TrustBar components on the same page.
   */
  readonly headingId?: string
}

/**
 * TrustBar: Compact strip of trusted technology/partner logos.
 * - Semantic <section> with an accessible (visually hidden) heading
 * - Empty state message when no brands are provided
 * - No client-only APIs; safe as a Server Component
 */
export default function TrustBar({
  items = BRANDS,
  heading = 'Trusted technology powering our hosting',
  className = '',
  muted = true,
  headingId = 'trustbar-heading',
}: TrustBarProps): React.ReactElement {
  const hasItems: boolean = items.length > 0

  return (
    <section
      className={`bg-white ${className}`}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h2 id={headingId} className="sr-only font-heading">
          {heading}
        </h2>

        {!hasItems ? (
          <p
            className="text-center text-sm text-gray-500"
            aria-live="polite"
          >
            No partner brands yet.
          </p>
        ) : (
          <ul
            role="list"
            className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-6 ${muted ? 'opacity-80' : ''}`}
            aria-label="Partner and platform logos"
          >
            {items.map((b) => (
              <li role="listitem" key={`${b.src}-${b.alt}`} className="h-8">
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                  sizes="(min-width: 1024px) 120px, 96px"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
