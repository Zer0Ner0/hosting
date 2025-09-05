import Image from "next/image";
import React, { memo } from "react";

/** Props for a single FeatureRow section */
export type FeatureRowProps = {
  /** Section heading */
  title: string;
  /** Supporting copy under the heading */
  copy: string;
  /** Optional bullet highlights (shown under copy) */
  bullets?: string[];
  /** Image source in /public or remote loader-configured domain */
  imageSrc: string;
  /** Descriptive alt text for the image */
  imageAlt: string;
  /** Set true to render the image on the left on large screens */
  imageLeft?: boolean;
  /** Set true for above-the-fold images */
  priority?: boolean;
  /** Use contain for SVG/diagrams to avoid cropping */
  imageContain?: boolean;
};

/** Ensure an ID-safe slug for aria-labelledby */
function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Media/Image block (responsive, rounded, no cropping unless requested) */
const MediaImage = memo(function MediaImage({
  src,
  alt,
  priority,
  contain,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  contain?: boolean;
}): JSX.Element {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[3/2]">
      <Image
        src={src}
        alt={alt}
        fill
        className={contain ? "object-contain object-center" : "object-cover object-center"}
        priority={Boolean(priority)}
        loading={priority ? "eager" : "lazy"}
        sizes="(min-width:1024px) 50vw, 100vw"
        draggable={false}
      />
    </div>
  );
});

/** Bulleted list of feature highlights (brand colors, accessible) */
const BulletList = memo(function BulletList({ bullets }: { bullets: string[] }): JSX.Element | null {
  if (!bullets || bullets.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2 font-sans text-neutral-900/80" role="list" aria-label="Key highlights">
      {bullets.map((b, i) => (
        <li key={`${b}-${i}`} className="flex items-start gap-2">
          {/* Brand primary dot (#166534) */}
          <span
            className="mt-1 inline-block h-2 w-2 rounded-full bg-[#166534]"
            aria-hidden="true"
          />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
});

function FeatureRow({
  title,
  copy,
  bullets = [],
  imageSrc,
  imageAlt,
  imageLeft = false,
  priority = false,
  imageContain = false,
}: FeatureRowProps): JSX.Element {
  const headingId = `feature-${slugify(title)}`;

  const TextBlock = (
    <div className="flex flex-col justify-center">
      <h3
        id={headingId}
        className="font-heading text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
      >
        {title}
      </h3>
      <p className="mt-3 font-sans text-neutral-900/80">{copy}</p>
      <BulletList bullets={bullets} />
    </div>
  );

  return (
    <section className="bg-white" aria-labelledby={headingId}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {imageLeft ? (
          <>
            <MediaImage src={imageSrc} alt={imageAlt} priority={priority} contain={imageContain} />
            {TextBlock}
          </>
        ) : (
          <>
            {TextBlock}
            <MediaImage src={imageSrc} alt={imageAlt} priority={priority} contain={imageContain} />
          </>
        )}
      </div>
    </section>
  );
}

export default memo(FeatureRow);
