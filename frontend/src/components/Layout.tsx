import React, { PropsWithChildren } from 'react';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/nav/Footer';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
