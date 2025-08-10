// frontend/src/pages/login.tsx
"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const { status } = useSession();

  // If already authed, bounce to home (or /checkout)
  useEffect(() => {
    if (status === "authenticated") {
      window.location.replace("/");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main className="container mx-auto px-4 md:px-6 py-10">
        <p className="text-gray-600">Checking session…</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <p className="text-gray-600 mb-6">
        Use your Google account to continue.
      </p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sign in with Google
      </button>
    </main>
  );
}
