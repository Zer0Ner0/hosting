// frontend/src/components/web_builder/templates.data.ts
import type { Template, TemplateSection } from "@/types/Builder";

export const TEMPLATES: Template[] = [
  {
    id: "tmpl-business-01",
    title: "Aurora Consulting",
    slug: "aurora-consulting",
    category: "Business",
    description: "Clean corporate layout with services, team, and CTA blocks.",
    thumbnail: "/images/placeholders/template-aurora.svg",
    tags: ["services", "corporate", "minimal"],
    isFree: true,
    createdAt: "2025-07-20T00:00:00.000Z",
    popularity: 88,
  },
  {
    id: "tmpl-portfolio-01",
    title: "LensCraft Portfolio",
    slug: "lenscraft-portfolio",
    category: "Portfolio",
    description: "Grid-based gallery, lightbox, and case studies.",
    thumbnail: "/images/placeholders/template-lenscraft.svg",
    tags: ["portfolio", "gallery", "photography"],
    isFree: false,
    createdAt: "2025-06-11T00:00:00.000Z",
    popularity: 76,
  },
  {
    id: "tmpl-landing-01",
    title: "LaunchPad SaaS",
    slug: "launchpad-saas",
    category: "Landing",
    description: "Hero with social proof, pricing, and FAQ sections.",
    thumbnail: "/images/placeholders/template-launchpad.svg",
    tags: ["saas", "pricing", "startup"],
    isFree: true,
    createdAt: "2025-08-01T00:00:00.000Z",
    popularity: 93,
  },
  {
    id: "tmpl-ecom-01",
    title: "Cendol Store",
    slug: "cendol-store",
    category: "E-Commerce",
    description: "Product grid, cart preview, and testimonial rail.",
    thumbnail: "/images/placeholders/template-cendol.svg",
    tags: ["shop", "malaysia", "green"],
    isFree: false,
    createdAt: "2025-05-03T00:00:00.000Z",
    popularity: 81,
  },
  {
    id: "tmpl-blog-01",
    title: "Serene Blog",
    slug: "serene-blog",
    category: "Blog",
    description: "Magazine layout with tags and related posts.",
    thumbnail: "/images/placeholders/template-serene.svg",
    tags: ["blog", "magazine", "reading"],
    isFree: true,
    createdAt: "2025-04-23T00:00:00.000Z",
    popularity: 69,
  },
];

export const TEMPLATE_SECTIONS: Record<string, TemplateSection[]> = {
  "aurora-consulting": [
    { id: "hero",     label: "Hero",     enabledByDefault: true },
    { id: "features", label: "Features", enabledByDefault: true },
    { id: "gallery",  label: "Gallery",  enabledByDefault: false },
    { id: "pricing",  label: "Pricing",  enabledByDefault: true },
    { id: "faq",      label: "FAQ",      enabledByDefault: true },
    { id: "cta",      label: "Bottom CTA", enabledByDefault: true },
  ],
  "lenscraft-portfolio": [
    { id: "hero",     label: "Hero",     enabledByDefault: true },
    { id: "gallery",  label: "Gallery",  enabledByDefault: true },
    { id: "features", label: "Features", enabledByDefault: false },
    { id: "pricing",  label: "Pricing",  enabledByDefault: false },
    { id: "faq",      label: "FAQ",      enabledByDefault: true },
    { id: "cta",      label: "Bottom CTA", enabledByDefault: true },
  ],
  "launchpad-saas": [
    { id: "hero",     label: "Hero",     enabledByDefault: true },
    { id: "features", label: "Features", enabledByDefault: true },
    { id: "pricing",  label: "Pricing",  enabledByDefault: true },
    { id: "faq",      label: "FAQ",      enabledByDefault: true },
    { id: "cta",      label: "Bottom CTA", enabledByDefault: true },
  ],
  "cendol-store": [
    { id: "hero",     label: "Hero",     enabledByDefault: true },
    { id: "features", label: "Features", enabledByDefault: true },
    { id: "gallery",  label: "Gallery",  enabledByDefault: true },
    { id: "faq",      label: "FAQ",      enabledByDefault: true },
    { id: "cta",      label: "Bottom CTA", enabledByDefault: true },
  ],
  "serene-blog": [
    { id: "hero",     label: "Hero",     enabledByDefault: true },
    { id: "features", label: "Features", enabledByDefault: false },
    { id: "faq",      label: "FAQ",      enabledByDefault: true },
    { id: "cta",      label: "Bottom CTA", enabledByDefault: true },
  ],
};

export function findTemplateBySlug(slug: string | undefined): Template | undefined {
  if (!slug) return undefined;
  return TEMPLATES.find((t) => t.slug === slug);
}