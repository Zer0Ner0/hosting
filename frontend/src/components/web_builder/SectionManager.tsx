// hosting/frontend/src/components/web_builder/SectionManager.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { SectionId, TemplateSection } from "@/types/Builder";
import type { BuilderState } from "@/types/Builder";
import { loadBuilderState, saveBuilderState, clearBuilderState } from "@/lib/builderStorage";

interface Props {
  /** Canonical list in visual-default order (id + label + default) */
  sections: TemplateSection[];
  /** Enabled map (controlled) */
  value: Record<SectionId, boolean>;
  /** Current visual order (controlled) */
  order: SectionId[];
  /** Controlled updates */
  onToggleChange: (next: Record<SectionId, boolean>) => void;
  onReorder: (nextOrder: SectionId[]) => void;
}

/** Small inline handle icon (no external deps) */
function DragIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M10 4h4v2h-4V4Zm0 7h4v2h-4v-2Zm0 7h4v2h-4v-2Z" fill="currentColor" />
    </svg>
  );
}

export default function SectionManager({
  sections,
  value,
  order,
  onToggleChange,
  onReorder,
}: Props) {
  // --- Setup & defaults
  const router = useRouter();
  const templateSlug = useMemo(() => {
    const t = router.query.template;
    return typeof t === "string" && t.trim() ? t : "default";
  }, [router.query.template]);

  const allowedIds = useMemo(() => new Set<SectionId>(sections.map((s) => s.id)), [sections]);

  const defaults = useMemo(() => {
    const defOrder = sections.map((s) => s.id);
    const defEnabled = sections.reduce((acc, s) => {
      acc[s.id] = s.enabledByDefault ?? true;
      return acc;
    }, {} as Record<SectionId, boolean>);
    return { order: defOrder, enabled: defEnabled };
  }, [sections]);

  // Keep a baseline snapshot for "Reset"
  const baselineRef = useRef(defaults);
  useEffect(() => {
    baselineRef.current = defaults;
  }, [defaults]);

  // --- Accessibility live region
  const [announce, setAnnounce] = useState<string>("");

  // Map for quick lookup
  const sectionById = useMemo(() => {
    const m = new Map<SectionId, TemplateSection>();
    for (const s of sections) m.set(s.id, s);
    return m;
  }, [sections]);

  // Items (filter unknown ids defensively)
  const items = useMemo(
    () =>
      order
        .map((id) => sectionById.get(id))
        .filter((v): v is TemplateSection => Boolean(v)),
    [order, sectionById],
  );

  // --- One-time hydration from localStorage -> push into parent via callbacks
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;

    const stored = loadBuilderState(templateSlug);
    // Filter to known ids, keep given order for known keys, append any missing
    const nextOrder: SectionId[] = (() => {
      const out: SectionId[] = [];
      for (const k of stored.order as SectionId[]) {
        if (allowedIds.has(k) && !out.includes(k)) out.push(k);
      }
      for (const s of sections) {
        if (!out.includes(s.id)) out.push(s.id);
      }
      return out;
    })();

    // Merge enabled: use stored if present, otherwise section defaults
    const nextEnabled: Record<SectionId, boolean> = sections.reduce((acc, s) => {
      const v = (stored.enabled as Partial<Record<SectionId, boolean>> | undefined)?.[s.id];
      acc[s.id] = typeof v === "boolean" ? v : (s.enabledByDefault ?? true);
      return acc;
    }, {} as Record<SectionId, boolean>);

    // Only push to parent if it changes something
    const differsOrder =
      order.length !== nextOrder.length || order.some((id, i) => id !== nextOrder[i]);
    const differsEnabled = sections.some((s) => (value[s.id] ?? false) !== nextEnabled[s.id]);

    if (differsOrder) onReorder(nextOrder);
    if (differsEnabled) onToggleChange(nextEnabled);

    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateSlug, sections, allowedIds]); // (intentionally excluding order/value to avoid loop)

  // --- Persist to localStorage whenever controlled value/order change (post-hydration)
  useEffect(() => {
    if (!hydratedRef.current) return;
    // Build a dense enabled map for only known ids
    const enabledForKnown = sections.reduce((acc, s) => {
      acc[s.id] = value[s.id] ?? (s.enabledByDefault ?? true);
      return acc;
    }, {} as Record<SectionId, boolean>);

    const state: BuilderState = {
      template: templateSlug,
      order: order.filter((id) => allowedIds.has(id)),
      enabled: enabledForKnown,
      updatedAt: Date.now(),
    };
    saveBuilderState(state);
  }, [templateSlug, sections, allowedIds, order, value]);

  // --- Reorder / Toggle handlers (use parent callbacks)
  const move = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= order.length || fromIndex === toIndex) return;
      const next = order.slice();
      const [spliced] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, spliced);
      onReorder(next);
      const label = sectionById.get(spliced)?.label ?? "Section";
      setAnnounce(`${label} moved to position ${toIndex + 1}.`);
    },
    [order, onReorder, sectionById],
  );

  const handleDragStart = (id: SectionId) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id); // Safari needs some data set
    (e.currentTarget as HTMLElement).setAttribute("aria-grabbed", "true");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (overId: SectionId) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData("text/plain") as SectionId;
    (e.currentTarget as HTMLElement).removeAttribute("aria-grabbed");
    if (!fromId || fromId === overId) return;
    const fromIndex = order.indexOf(fromId);
    const toIndex = order.indexOf(overId);
    if (fromIndex === -1 || toIndex === -1) return;
    move(fromIndex, toIndex);
  };

  const handleKeyMove = (idx: number, dir: -1 | 1) => () => move(idx, idx + dir);

  const toggle = (id: SectionId) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleChange({ ...value, [id]: e.target.checked });
  };

  // --- Reset & Clear controls
  const onReset = () => {
    const { order: defOrder, enabled: defEnabled } = baselineRef.current;
    onReorder(defOrder);
    onToggleChange(defEnabled);
    setAnnounce("Sections reset to defaults.");
  };

  const onClear = () => {
    clearBuilderState(templateSlug);
    onReset();
    setAnnounce("Saved layout cleared.");
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-700">Sections</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50 focus:outline-none focus:ring"
              aria-label="Reset sections to default"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50 focus:outline-none focus:ring"
              aria-label="Clear saved state"
            >
              Clear
            </button>
          </div>
        </div>

        <ul className="mt-3 space-y-2" role="list" aria-label="Reorder and toggle sections">
          {items.map((s, idx) => {
            const checked = value[s.id] ?? false;
            return (
              <li
                key={s.id}
                role="listitem"
                className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-white"
                draggable
                onDragStart={handleDragStart(s.id)}
                onDragOver={handleDragOver}
                onDrop={handleDrop(s.id)}
                aria-grabbed="false"
              >
                {/* Drag handle */}
                <span
                  className="cursor-grab text-gray-500 hover:text-gray-700"
                  title="Drag to reorder"
                  aria-hidden="true"
                >
                  <DragIcon className="h-5 w-5" />
                </span>

                {/* Toggle */}
                <input
                  id={`sec-${s.id}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={checked}
                  onChange={toggle(s.id)}
                />
                <label htmlFor={`sec-${s.id}`} className="flex-1 text-sm">
                  {s.label}
                </label>

                {/* Keyboard move buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleKeyMove(idx, -1)}
                    disabled={idx === 0}
                    className="rounded-lg border px-2 py-1 text-xs disabled:opacity-40 hover:bg-gray-50"
                    aria-label={`Move ${s.label} up`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={handleKeyMove(idx, +1)}
                    disabled={idx === items.length - 1}
                    className="rounded-lg border px-2 py-1 text-xs disabled:opacity-40 hover:bg-gray-50"
                    aria-label={`Move ${s.label} down`}
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div aria-live="polite" className="sr-only">
          {announce}
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Tip: Drag the handle to reorder. Use ↑/↓ buttons for keyboard.
        </p>
      </div>
    </aside>
  );
}
