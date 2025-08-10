// hosting/frontend/src/types/Builder.ts

/** ---------------------------------------------
 * Template metadata
 * ----------------------------------------------*/

// Canonical category list (use in filters/controls)
export const TEMPLATE_CATEGORIES = [
  "Business",
  "Portfolio",
  "Blog",
  "E-Commerce",
  "Landing",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export interface Template {
  id: string;
  title: string;
  slug: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string; // path in /public or remote URL
  tags: string[];
  isFree: boolean;
  createdAt: string; // ISO date
  popularity: number; // 0 - 100
}

/** ---------------------------------------------
 * Sections (single source of truth)
 * ----------------------------------------------*/

// Canonical section keys (order here mirrors DEFAULT_ORDER)
export const SECTION_KEYS = [
  "hero",
  "features",
  "gallery",
  "pricing",
  "faq",
  "cta",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

// Back-compat alias (old code may import SectionId)
export type SectionId = SectionKey;

export interface TemplateSection {
  id: SectionKey;
  label: string;
  enabledByDefault: boolean;
}

/** Default visual/render order. Clone (`slice`) before mutating. */
export const DEFAULT_ORDER: SectionKey[] = [...SECTION_KEYS];

/** ---------------------------------------------
 * Builder persistence
 * ----------------------------------------------*/

export interface BuilderState {
  template: string;
  order: SectionKey[];
  enabled: Record<SectionKey, boolean>;
  updatedAt: number; // epoch ms
}

/**
 * Create a default state for a template.
 * If `sections` provided, honor each section's `enabledByDefault`;
 * otherwise default to `true` for all sections.
 */
export function defaultState(
  template: string,
  sections?: ReadonlyArray<TemplateSection>
): BuilderState {
  const enabled = SECTION_KEYS.reduce((acc, k) => {
    const def = sections?.find((s) => s.id === k)?.enabledByDefault ?? true;
    acc[k] = def;
    return acc;
  }, {} as Record<SectionKey, boolean>);

  return {
    template,
    order: DEFAULT_ORDER.slice(),
    enabled,
    updatedAt: Date.now(),
  };
}

/** ---------------------------------------------
 * Tiny utilities (optional but handy)
 * ----------------------------------------------*/

/** Type guard: check if unknown value is a valid SectionKey. */
export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (SECTION_KEYS as readonly string[]).includes(value);
}

/**
 * Sanitize an arbitrary order into a valid, deduped SectionKey[].
 * - Drops unknown keys
 * - Preserves given order for known keys
 * - Appends any missing keys at the end (to keep UI resilient)
 */
export function sanitizeOrder(
  order: ReadonlyArray<SectionKey | string>
): SectionKey[] {
  const allowed = new Set<SectionKey>(SECTION_KEYS);
  const next: SectionKey[] = [];

  for (const k of order) {
    const key = (typeof k === "string" ? (k as SectionKey) : k);
    if (allowed.has(key) && !next.includes(key)) next.push(key);
  }

  for (const k of SECTION_KEYS) {
    if (!next.includes(k)) next.push(k);
  }
  return next;
}

/**
 * Merge a (possibly partial) enabled map with a fallback/default map.
 * Unknown/missing keys fall back to `true` unless fallback says otherwise.
 */
export function mergeEnabled(
  current: Partial<Record<SectionKey, boolean>> | undefined,
  fallback: Readonly<Record<SectionKey, boolean>>
): Record<SectionKey, boolean> {
  const out = {} as Record<SectionKey, boolean>;
  for (const k of SECTION_KEYS) {
    out[k] = current?.[k] ?? fallback[k] ?? true;
  }
  return out;
}
