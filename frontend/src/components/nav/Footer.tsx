// frontend/src/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterColumnProps {
  title: string;
  id: string;
  links: FooterLink[];
}

interface BrandBadge {
  src: string;
  alt: string;
}

function FooterColumn({ title, id, links }: FooterColumnProps): JSX.Element {
  return (
    <nav aria-labelledby={id}>
      <h3 id={id} className="font-heading text-sm font-semibold text-white">
        {title}
      </h3>
      <ul role="list" className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li role="listitem" key={`${id}-${link.label}`}>
            {link.external ? (
              <a
                href={link.href}
                className="rounded hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                rel="noopener noreferrer"
                target="_blank"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="rounded hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                aria-label={link.label}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function BrandBadges({ badges }: { badges: BrandBadge[] }): JSX.Element {
  return (
    <ul role="list" className="mt-6 flex flex-wrap items-center gap-3">
      {badges.map((b) => (
        <li role="listitem" key={b.alt}>
          <Image
            src={b.src}
            alt={b.alt}
            width={112}
            height={32}
            className="opacity-80"
            loading="lazy"
            sizes="112px"
          />
        </li>
      ))}
    </ul>
  );
}

const PRODUCT_LINKS: FooterLink[] = [
  { href: "/hosting", label: "Web Hosting" },
  { href: "/hosting#wordpress", label: "WordPress Hosting" },
  { href: "/hosting#woocommerce", label: "WooCommerce Hosting" },
  { href: "/hosting#email", label: "Email Hosting" },
  { href: "/builder", label: "Website Builder" },
];

const COMPANY_LINKS: FooterLink[] = [
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "https://status.yourbrand.com", label: "System Status", external: true },
];

const LEGAL_LINKS: FooterLink[] = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/aup", label: "Acceptable Use" },
];

const BADGES: BrandBadge[] = [
  { src: "/images/brands/cpanel.svg", alt: "cPanel" },
  { src: "/images/brands/litespeed.svg", alt: "LiteSpeed" },
  { src: "/images/brands/cloudlinux.svg", alt: "CloudLinux" },
  { src: "/images/brands/imunify.svg", alt: "Imunify" },
];

export default function Footer(): JSX.Element {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-slate-300">
      {/* CTA band */}
      <div className="bg-gradient-to-b from-emerald-800 to-emerald-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">
              Ready to launch faster?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Start with NVMe + LiteSpeed and scale when you grow.
            </p>
          </div>
          <Link
            href="/hosting"
            aria-label="View hosting plans"
            className="btn-primary inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold aria-[busy=true]:opacity-70"
          >
            View Plans
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand blurb */}
          <section className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2" aria-label="YourBrand">
              <div
                className="h-8 w-8 rounded-md bg-emerald-900"
                aria-hidden="true"
              />
              <span className="font-heading text-lg font-semibold text-white">
                YourBrand
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              High-speed cloud hosting with NVMe, LiteSpeed, free SSL, and 24/7
              expert support.
            </p>
            <BrandBadges badges={BADGES} />
          </section>

          {/* Columns */}
          <FooterColumn id="footer-products" title="Products" links={PRODUCT_LINKS} />
          <FooterColumn id="footer-company" title="Company" links={COMPANY_LINKS} />
          <FooterColumn id="footer-legal" title="Legal" links={LEGAL_LINKS} />
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-sans">
              © {currentYear} YourBrand. All rights reserved.
            </p>
            <address className="not-italic">
              <div className="flex items-center gap-4">
                <a
                  href="tel:60123456789"
                  className="rounded hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  aria-label="Call support at 60 12 345 6789"
                >
                  60 12 345 6789
                </a>
                <a
                  href="mailto:support@yourbrand.com"
                  className="rounded hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  aria-label="Email support at support@yourbrand.com"
                >
                  support@yourbrand.com
                </a>
                <Link
                  href="/login"
                  className="rounded hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  aria-label="Client login"
                >
                  Client Login
                </Link>
              </div>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
