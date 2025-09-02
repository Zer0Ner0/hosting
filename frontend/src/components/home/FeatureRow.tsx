import Image from "next/image";
import React, { memo } from "react";

type FeatureRowProps = {
  title: string;
  copy: string;
  bullets?: string[];
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
  /** Set true for above-the-fold images */
  priority?: boolean;
  /** Use contain for SVG/diagrams to avoid cropping */
  imageContain?: boolean;
};

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
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[3/2]">
      <Image
        src={src}
        alt={alt}
        fill
        className={contain ? "object-contain object-center" : "object-cover object-center"}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 50vw, 100vw"
        draggable={false}
      />
    </div>
  );
});

const BulletList = memo(function BulletList({ bullets }: { bullets: string[] }) {
  if (!bullets || bullets.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2 text-slate-700" role="list">
      {bullets.map((b, i) => (
        <li key={`${b}-${i}`} className="flex items-start gap-2">
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-700" aria-hidden />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function FeatureRow({
  title,
  copy,
  bullets = [],
  imageSrc,
  imageAlt,
  imageLeft = false,
  priority = false,
  imageContain = false,
}: FeatureRowProps) {
  const headingId = `feature-${slugify(title)}`;

  const Text = (
    <div className="flex flex-col justify-center">
      <h3 id={headingId} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-slate-600">{copy}</p>
      <BulletList bullets={bullets} />
    </div>
  );

  return (
    <section className="bg-white" aria-labelledby={headingId}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {imageLeft ? (
          <>
            <MediaImage src={imageSrc} alt={imageAlt} priority={priority} contain={imageContain} />
            {Text}
          </>
        ) : (
          <>
            {Text}
            <MediaImage src={imageSrc} alt={imageAlt} priority={priority} contain={imageContain} />
          </>
        )}
      </div>
    </section>
  );
}

export default memo(FeatureRow);
