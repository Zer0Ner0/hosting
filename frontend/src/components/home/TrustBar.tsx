import React from "react";
import Image from "next/image";

export default function TrustBar() {
  return (
    <section aria-label="Trust indicators" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Rating pill */}
          <div className="flex items-center gap-3 rounded-full border px-4 py-2">
            <div className="flex" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 20 20"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium">Rated “Excellent” by customers</span>
          </div>

          {/* Logo row */}
          <ul className="grid w-full grid-cols-2 items-center gap-4 sm:w-auto sm:grid-cols-5">
            {[
              { src: "/images/brands/cpanel.svg", alt: "cPanel" },
              { src: "/images/brands/litespeed.svg", alt: "LiteSpeed" },
              { src: "/images/brands/cloudlinux.svg", alt: "CloudLinux" },
              { src: "/images/brands/imunify.svg", alt: "Imunify" },
              { src: "/images/brands/wordpress.svg", alt: "WordPress" },
            ].map((logo) => (
              <li key={logo.alt} className="flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={112}
                  height={32}
                  className="h-8 w-28 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
