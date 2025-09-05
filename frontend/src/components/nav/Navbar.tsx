/* eslint-disable jsx-a11y/no-redundant-roles */
"use client";

import Link from "next/link";
import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import MegaMenu, { MegaMenuItem } from "./MegaMenu";

export default function Navbar(): JSX.Element {
  const headerRef = React.useRef<HTMLElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeTimer = React.useRef<number | null>(null);

  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [hostingOpen, setHostingOpen] = React.useState<boolean>(false);

  const { data: session } = useSession();
  const isAuthed = !!session;

  // --- helpers ---------------------------------------------------------------
  const clearTimer = React.useCallback((): void => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openHosting = React.useCallback((): void => {
    clearTimer();
    setHostingOpen(true);
  }, [clearTimer]);

  const scheduleCloseHosting = React.useCallback((): void => {
    clearTimer();
    // gentle delay to avoid flicker when moving between trigger and panel
    closeTimer.current = window.setTimeout(() => setHostingOpen(false), 350);
  }, [clearTimer]);

  const cancelCloseHosting = React.useCallback((): void => {
    clearTimer();
  }, [clearTimer]);


  // (Optional) If you want to return focus for keyboard users only,
  // you can re-introduce a conditional focus routine later.
  // Removing auto-focus avoids post-click highlight on the trigger.

  const HOSTING_ITEMS: MegaMenuItem[] = React.useMemo(
    () => [
      { label: "Web Hosting", href: "/hosting/web", description: "Fast cPanel hosting for sites of any size." },
      { label: "WordPress Hosting", href: "/hosting/wordpress", description: "Optimized stack for WordPress." },
      { label: "WooCommerce Hosting", href: "/hosting/woocommerce", description: "Power your online store quickly." },
      { label: "Email Hosting", href: "/hosting/email", description: "Professional email on your domain." },
    ],
    []
  );

  // Close mega on scroll
  React.useEffect(() => {
    const onScroll = (): void => setHostingOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega when opening mobile menu
  React.useEffect(() => {
    if (mobileOpen) setHostingOpen(false);
  }, [mobileOpen]);

  // Cleanup any pending timers on unmount
  React.useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-blue-900 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <div className="bg-blue-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+60123456789" className="hover:underline">
              📞 Sales: +60 12-345 6789
            </a>
            <a href="#chat" className="hover:underline">
              💬 Live Chat
            </a>
          </div>
          <div className="hidden sm:block">99.9% Uptime • 24/7 Support</div>
        </div>
      </div>

      {/* Main bar */}
      <div className="relative border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4" role="navigation" aria-label="Primary">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center font-semibold text-gray-900">
              <span className="text-blue-900">Host</span>Pro
            </Link>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-2 md:flex">
              <li className="relative">
                <button
                  type="button"
                  id="hosting-trigger"
                  aria-haspopup="true"
                  aria-expanded={hostingOpen}
                  className={[
                    // Keep hover styles; add focus-visible ring (keyboard only), not filled background
                    "rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200",
                    hostingOpen ? "bg-blue-50 text-blue-900" : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                  onMouseEnter={openHosting}
                  onMouseLeave={scheduleCloseHosting}
                  onFocus={openHosting}
                  onClick={() => setHostingOpen((v) => !v)}
                  ref={triggerRef}
                >
                  Hosting
                </button>
              </li>

              <li>
                <Link href="/builder" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Website Builder
                </Link>
              </li>
              <li>
                <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            {isAuthed ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 md:inline-block"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 md:inline-block"
              >
                Login
              </Link>
            )}
            <button
              className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        {/* Desktop mega menu */}
        <div className="hidden md:block">
          <MegaMenu
            isOpen={hostingOpen}
            onClose={() => setHostingOpen(false)}
            anchorId="hosting-trigger"
            items={HOSTING_ITEMS}
            onMouseEnter={cancelCloseHosting}
            onMouseLeave={scheduleCloseHosting}
          />
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={[
            "md:hidden transition-all duration-150 overflow-hidden border-top border-gray-200 bg-white",
            mobileOpen ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="px-4 py-3">
            {/* Hosting accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>Hosting</span>
                <span className="transition group-open:rotate-180">⌄</span>
              </summary>
              <ul className="mt-1 space-y-1 pl-2">
                {HOSTING_ITEMS.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <Link
              href="/builder"
              className="mt-1 block rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Website Builder
            </Link>
            <Link
              href="/blog"
              className="mt-1 block rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>

            {/* Anchor to keep skip link target valid on all pages */}
            <Link href="#" className="sr-only" />
            {isAuthed ? (
              <button
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
