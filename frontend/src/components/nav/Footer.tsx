import Link from "next/link";
import Image from "next/image";
import React, { memo, useMemo } from "react";

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

const FooterColumn = memo(function FooterColumn({ title, id, links }: FooterColumnProps): JSX.Element {
  return (
    <nav aria-labelledby={id}>
      <h3 id={id} className="text-sm font-semibold text-white">
        {title}
      </h3>
      <ul role="list" className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li role="listitem" key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
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
});

const BrandBadges = memo(function BrandBadges({ badges }: { badges: BrandBadge[] }): JSX.Element {
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
});

export default function Footer(): JSX.Element {
  const currentYear = useMemo<number>(() => new Date().getFullYear(), []);

  const productLinks: FooterLink[] = useMemo(
    () => [
      { href: "/hosting", label: "Web Hosting" },
      { href: "/hosting#wordpress", label: "WordPress Hosting" },
      { href: "/hosting#woocommerce", label: "WooCommerce Hosting" },
      { href: "/hosting#email", label: "Email Hosting" },
      { href: "/builder", label: "Website Builder" },
    ],
    []
  );

  const companyLinks: FooterLink[] = useMemo(
    () => [
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About" },
      { href: "https://status.yourbrand.com", label: "System Status", external: true },
    ],
    []
  );

  const legalLinks: FooterLink[] = useMemo(
    () => [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refund", label: "Refund Policy" },
      { href: "/aup", label: "Acceptable Use" },
    ],
    []
  );

  const badges: BrandBadge[] = useMemo(
    () => [
      { src: "/images/brands/cpanel.svg", alt: "cPanel" },
      { src: "/images/brands/litespeed.svg", alt: "LiteSpeed" },
      { src: "/images/brands/cloudlinux.svg", alt: "CloudLinux" },
      { src: "/images/brands/imunify.svg", alt: "Imunify" },
    ],
    []
  );

  return (
    <footer className="bg-blue-950 text-slate-300">
      {/* CTA band */}
      <div className="bg-gradient-to-b from-blue-800 to-blue-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to launch faster?</h2>
            <p className="mt-1 text-sm text-slate-400">Start with NVMe  LiteSpeed and scale when you grow.</p>
          </div>
          <Link
            href="/hosting"
            aria-label="View hosting plans"
            className="inline-flex items-center justify-center rounded-full bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            View Plans
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand  blurb */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2" aria-label="YourBrand">
              <div className="h-8 w-8 rounded-md bg-blue-900" aria-hidden />
              <span className="text-lg font-semibold text-white">YourBrand</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              High-speed cloud hosting with NVMe, LiteSpeed, free SSL, and 24/7 expert support.
            </p>
            <BrandBadges badges={badges} />
          </div>

          {/* Columns */}
          <FooterColumn id="footer-products" title="Products" links={productLinks} />
          <FooterColumn id="footer-company" title="Company" links={companyLinks} />
          <FooterColumn id="footer-legal" title="Legal" links={legalLinks} />
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p>
              © {currentYear} YourBrand. All rights reserved.
            </p>
            <address className="not-italic">
              <div className="flex items-center gap-4">
                <a href="tel:60123456789" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded" aria-label="Call support at 60 12 345 6789">
                  60 12 345 6789
                </a>
                <a href="mailto:support@yourbrand.com" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded" aria-label="Email support at support@yourbrand.com">
                  support@yourbrand.com
                </a>
                <Link href="/login" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded" aria-label="Client login">
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