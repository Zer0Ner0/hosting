import React from 'react'
import Image from 'next/image'

interface Brand {
  src: string
  alt: string
}

export const BRANDS: ReadonlyArray<Brand> = [
  { src: '/images/brands/cpanel.svg', alt: 'cPanel' },
  { src: '/images/brands/litespeed.svg', alt: 'LiteSpeed' },
  { src: '/images/brands/cloudlinux.svg', alt: 'CloudLinux' },
  { src: '/images/brands/imunify.svg', alt: 'Imunify360' },
  { src: '/images/brands/wordpress.svg', alt: 'WordPress' },
] as const

interface Props {
  /** Override the default list of brand logos */
  items?: ReadonlyArray<Brand>
  /** Accessible label for the section heading (visually hidden) */
  heading?: string
  /** Optional className passthrough for outer section */
  className?: string
  /** Reduce visual prominence (adds opacity) */
  muted?: boolean
}

export default function TrustBar({
  items = BRANDS,
  heading = 'Trusted technology powering our hosting',
  className = '',
  muted = true,
}: Props): React.ReactElement {
  const hasItems = items.length > 0

  return (
    <section
      className={`bg-white ${className}`}
      aria-labelledby="trustbar-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h2 id="trustbar-heading" className="sr-only">
          {heading}
        </h2>

        {!hasItems ? (
          <p className="text-center text-sm text-gray-500">No partner brands yet.</p>
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