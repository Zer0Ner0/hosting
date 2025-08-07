// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyHosting
        </Link>
        <div className="space-x-6 hidden md:flex">
          <Link href="/hosting" className="text-gray-700 hover:text-blue-600">Hosting</Link>
          <Link href="/builder" className="text-gray-700 hover:text-blue-600">Website Builder</Link>
          <Link href="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
          <Link href="/login" className="text-blue-600 font-semibold border border-blue-600 px-4 py-1 rounded hover:bg-blue-600 hover:text-white transition">Login</Link>
        </div>
      </div>
    </nav>
  );
}
