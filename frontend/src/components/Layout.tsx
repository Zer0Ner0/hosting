// frontend/src/components/Layout.tsx
import React, { PropsWithChildren } from "react";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/nav/Footer";

export default function Layout({ children }: PropsWithChildren): JSX.Element {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen font-sans text-neutral-900">
        {children}
      </main>
      <Footer />
    </>
  );
}
