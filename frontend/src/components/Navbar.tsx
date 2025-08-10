"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/hosting", label: "Hosting" },
  { href: "/builder", label: "Website Builder" },
  { href: "/blog", label: "Blog" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center text-sm font-medium transition-colors",
        active ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession(); // client-only
  const authed = status === "authenticated";
  const loading = status === "loading";
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MyHosting
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-28 rounded-md bg-gray-200 animate-pulse" aria-hidden />
            ) : authed ? (
              <>
                <span className="hidden sm:block text-sm">
                  Hi, {session?.user?.name?.split(" ")[0] ?? "there"}
                </span>
                <button
                  onClick={() => signOut()}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={open ? "true" : "false"}
            aria-label="Toggle menu"
          >
            {open ? (
              // Close icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.225 4.811 4.81 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          className={`md:hidden ${open ? "block" : "hidden"} border-t pb-4`}
          role="dialog"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col gap-3 pt-4" aria-label="Mobile Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "px-1.5 py-2 rounded-md text-base",
                  isActive(item.href) ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}

            {loading ? null : authed ? (
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="mt-2 rounded-md border px-3 py-2 text-sm text-left hover:bg-gray-50"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
