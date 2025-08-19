import Image from "next/image";
import React from "react";

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

export default function FeatureRow({
  title,
  copy,
  bullets = [],
  imageSrc,
  imageAlt,
  imageLeft,
  priority = false,
}: FeatureRowProps) {
  const Img = (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[3/2]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        draggable={false}
      />
    </div>

  );

  const Text = (
    <div className="flex flex-col justify-center">
      <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
      <p className="mt-3 text-slate-600">{copy}</p>
      <ul className="mt-4 space-y-2 text-slate-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {imageLeft ? (
          <>
            {Img}
            {Text}
          </>
        ) : (
          <>
            {Text}
            {Img}
          </>
        )}
      </div>
    </section>
  );
}
