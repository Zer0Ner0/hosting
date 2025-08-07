// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm mt-10">
      <div className="container mx-auto px-4 py-8 text-center">
        <p>© {new Date().getFullYear()} MyHosting. All rights reserved.</p>
      </div>
    </footer>
  );
}
