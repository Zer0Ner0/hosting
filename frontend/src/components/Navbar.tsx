import React from "react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
      {/* Slim top bar */}
      <div className="bg-slate-900 text-slate-200">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href="tel:+60123456789" className="inline-flex items-center gap-1 hover:text-white">
              <PhoneIcon className="h-3.5 w-3.5" />
              <span>Sales: +60 12 345 6789</span>
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-white"
              onClick={() => {
                // TODO: wire to your chat provider (Tawk/Crisp/etc.)
                // @ts-ignore
                window?.$crisp?.push(["do", "chat:open"]);
              }}
            >
              <ChatIcon className="h-3.5 w-3.5" />
              <span>24/7 Live Chat</span>
            </button>
            <a href="mailto:support@yourbrand.com" className="hidden items-center gap-1 hover:text-white sm:inline-flex">
              <MailIcon className="h-3.5 w-3.5" />
              <span>support@yourbrand.com</span>
            </a>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/login" className="hover:text-white">Login</Link>
            <a href="https://status.yourbrand.com" className="hover:text-white">Status</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              {/* Swap to your SVG logo if you have one */}
              <div className="h-8 w-8 rounded-md bg-emerald-600" aria-hidden />
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                YourBrand
              </span>
            </Link>
          </div>

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <li><Link href="/hosting" className="hover:text-slate-900">Hosting</Link></li>
            <li><Link href="/builder" className="hover:text-slate-900">Website Builder</Link></li>
            <li><Link href="/blog" className="hover:text-slate-900">Blog</Link></li>
            {/* Add more top-level links if needed */}
          </ul>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/hosting"
              className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 md:inline-block"
            >
              View Plans
            </Link>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden">
            <div className="space-y-1 border-t py-3 text-sm">
              <Link href="/hosting" className="block px-1 py-2">Hosting</Link>
              <Link href="/builder" className="block px-1 py-2">Website Builder</Link>
              <Link href="/blog" className="block px-1 py-2">Blog</Link>
            </div>
            <div className="border-t py-3">
              <Link
                href="/hosting"
                className="block w-full rounded-full bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* --- tiny inline icons (no extra deps) --- */
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M2 5a2 2 0 0 1 2-2h2l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v2a2 2 0 0 1-2 2h-1C8.82 19 5 15.18 5 10V9a2 2 0 0 1 2-2H7" />
    </svg>
  );
}
function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M8 10h8M8 14h5M21 12a9 9 0 1 1-3.1-6.7L21 5v7z" />
    </svg>
  );
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M4 6h16v12H4zM22 6l-10 7L2 6" />
    </svg>
  );
}
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  );
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/>
    </svg>
  );
}
