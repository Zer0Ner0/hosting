import Image from "next/image";

const BRANDS = [
  { src: "/images/brands/cpanel.svg", alt: "cPanel" },
  { src: "/images/brands/litespeed.svg", alt: "LiteSpeed" },
  { src: "/images/brands/cloudlinux.svg", alt: "CloudLinux" },
  { src: "/images/brands/imunify.svg", alt: "Imunify360" },
  { src: "/images/brands/wordpress.svg", alt: "WordPress" },
];

export default function TrustBar() {
  return (
    <section className="border-y bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80">
          {BRANDS.map(b => (
            <li key={b.alt} className="h-8">
              <Image src={b.src} alt={b.alt} width={120} height={32} className="h-8 w-auto" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
