// frontend/src/pages/_app.tsx
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { Inter, Poppins } from "next/font/google";
import { useEffect, useRef } from "react";

// Load corporate fonts and expose as CSS variables
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function App({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  // Safely extract NextAuth session without using `any`
  const { session, ...restPageProps } = (pageProps ?? {}) as {
    session?: Session;
    [key: string]: unknown;
  };

  // Accessible "Skip to content" focus management
  const mainRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // Guard for browser-only APIs
    if (typeof window === "undefined") return;
  }, []);

  return (
    <div
      className={`${inter.variable} ${poppins.variable} font-sans bg-neutral-50 text-neutral-900 min-h-screen`}
    >
      <Head>
        <meta name="theme-color" content="#166534" />
        {/* Default meta; pages can override via next/head */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:text-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <SessionProvider session={session}>
        <Layout>
          <main
            id="main-content"
            ref={mainRef}
            role="main"
            aria-live="polite"
            className="min-h-[60vh]"
          >
            <Component {...restPageProps} />
          </main>
        </Layout>
      </SessionProvider>
    </div>
  );
}
