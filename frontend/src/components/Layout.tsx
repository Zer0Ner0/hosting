import React, { PropsWithChildren } from 'react';
import Link from 'next/link';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">AmirHost</Link>
          <div className="space-x-6 text-sm">
            <Link href="/hosting">Hosting</Link>
            <Link href="/builder">Website Builder</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/login" className="btn">Login</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} AmirHost. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
