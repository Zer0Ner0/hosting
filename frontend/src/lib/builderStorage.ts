// hosting/frontend/src/lib/builderStorage.ts
/* eslint-disable no-restricted-globals */
import { BuilderState, DEFAULT_ORDER, SectionKey, defaultState } from "@/types/Builder";

const VERSION = 1;

const hasWindow = (): boolean => typeof window !== "undefined";

const keyFor = (template: string): string => `builder:v${VERSION}:${template}`;

function sanitize(state: BuilderState): BuilderState {
  // Keep only known keys and ensure order contains valid SectionKey[]
  const allowed = new Set<SectionKey>(DEFAULT_ORDER);
  const order = state.order.filter((k): k is SectionKey => allowed.has(k));
  const enabled: Record<SectionKey, boolean> = {} as Record<SectionKey, boolean>;
  DEFAULT_ORDER.forEach((k) => {
    enabled[k] = state.enabled[k] ?? true;
  });
  return {
    template: state.template,
    order: order.length ? order : DEFAULT_ORDER.slice(),
    enabled,
    updatedAt: state.updatedAt || Date.now(),
  };
}

export function loadBuilderState(template: string): BuilderState {
  if (!hasWindow()) return defaultState(template);
  try {
    const raw = localStorage.getItem(keyFor(template));
    if (!raw) return defaultState(template);
    const parsed = JSON.parse(raw) as BuilderState;
    return sanitize(parsed);
  } catch {
    return defaultState(template);
  }
}

let saveRaf: number | null = null;
let queued: BuilderState | null = null;

/** Debounced save (requestIdleCallback -> rAF fallback). */
export function saveBuilderState(state: BuilderState): void {
  if (!hasWindow()) return;
  queued = { ...state, updatedAt: Date.now() };

  const doWrite = () => {
    if (!queued) return;
    try {
      localStorage.setItem(keyFor(queued.template), JSON.stringify(queued));
    } catch {
      // ignore quota errors
    } finally {
      queued = null;
      saveRaf = null;
    }
  };

  // Prefer idle, fallback to rAF
  // @ts-expect-error - not in TS lib by default
  if (typeof requestIdleCallback === "function") {
    // @ts-expect-error
    requestIdleCallback(doWrite, { timeout: 500 });
  } else {
    if (saveRaf) cancelAnimationFrame(saveRaf);
    saveRaf = requestAnimationFrame(doWrite);
  }
}

export function clearBuilderState(template: string): void {
  if (!hasWindow()) return;
  try {
    localStorage.removeItem(keyFor(template));
  } catch {
    /* noop */
  }
}
