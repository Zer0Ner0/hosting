import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">MyHosting</Link>
        <div className="space-x-6 hidden md:flex">
          <Link href="/hosting" className="text-gray-700 hover:text-blue-600">Hosting</Link>
          <Link href="/builder" className="text-gray-700 hover:text-blue-600">Website Builder</Link>
          <Link href="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
          <Link href="/login" className="text-blue-600 font-semibold border border-blue-600 px-4 py-1 rounded hover:bg-blue-600 hover:text-white transition">Login</Link>
        </div>
        <div className="flex items-center gap-3">
          {authed ? (
            <>
              <span className="hidden sm:block text-sm">Hi, {session?.user?.name?.split(" ")[0]}</span>
              <button onClick={() => signOut()} className="rounded-md border px-3 py-1.5 text-sm">
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => signIn("google")} className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}