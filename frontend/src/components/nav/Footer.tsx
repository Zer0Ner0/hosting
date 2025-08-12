import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* CTA band */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to launch faster?</h2>
            <p className="mt-1 text-sm text-slate-400">Start with NVMe + LiteSpeed and scale when you grow.</p>
          </div>
          <Link
            href="/hosting"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            View Plans
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + blurb */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-emerald-600" aria-hidden />
              <span className="text-lg font-semibold text-white">YourBrand</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              High-speed cloud hosting with NVMe, LiteSpeed, free SSL, and 24/7 expert support.
            </p>

            {/* Trust badges (use your neutral SVGs from earlier) */}
            <ul className="mt-6 flex flex-wrap items-center gap-3">
              {[
                { src: "/images/brands/cpanel.svg", alt: "cPanel" },
                { src: "/images/brands/litespeed.svg", alt: "LiteSpeed" },
                { src: "/images/brands/cloudlinux.svg", alt: "CloudLinux" },
                { src: "/images/brands/imunify.svg", alt: "Imunify" },
              ].map((b) => (
                <li key={b.alt}>
                  <Image src={b.src} alt={b.alt} width={112} height={32} className="opacity-80" />
                </li>
              ))}
            </ul>
          </div>

          {/* Columns */}
          <div>
            <h3 className="text-sm font-semibold text-white">Products</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/hosting" className="hover:text-white">Web Hosting</Link></li>
              <li><Link href="/hosting#wordpress" className="hover:text-white">WordPress Hosting</Link></li>
              <li><Link href="/hosting#woocommerce" className="hover:text-white">WooCommerce Hosting</Link></li>
              <li><Link href="/hosting#email" className="hover:text-white">Email Hosting</Link></li>
              <li><Link href="/builder" className="hover:text-white">Website Builder</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><a href="https://status.yourbrand.com" className="hover:text-white">System Status</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
              <li><Link href="/aup" className="hover:text-white">Acceptable Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p>© {new Date().getFullYear()} YourBrand. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="tel:+60123456789" className="hover:text-white">+60 12 345 6789</a>
              <a href="mailto:support@yourbrand.com" className="hover:text-white">support@yourbrand.com</a>
              <Link href="/login" className="hover:text-white">Client Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
