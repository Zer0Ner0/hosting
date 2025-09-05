// frontend/src/components/nav/MegaMenu.tsx
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useId, useRef } from "react";

export type MegaMenuItem = {
  label: string;
  href: string;
  description?: string;
};

type MegaMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorId: string; // id of the trigger element (used by aria-labelledby)
  items: MegaMenuItem[];
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

export default function MegaMenu({
  isOpen,
  onClose,
  anchorId,
  items,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const firstFocusable = useRef<HTMLAnchorElement | null>(null);
  const lastFocusable = useRef<HTMLAnchorElement | null>(null);
  const regionId = useId();
  const descId = `${regionId}-desc`;

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    return;
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) onClose();
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return;
  }, [isOpen, onClose]);

  // Move focus to first item when opened
  useEffect(() => {
    if (!isOpen) return;
    const rafId = window.requestAnimationFrame(() => {
      const focusables = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
      if (focusables.length > 0) {
        firstFocusable.current = focusables[0];
        lastFocusable.current = focusables[focusables.length - 1];
        firstFocusable.current?.focus();
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [isOpen, items]);

  // Keyboard navigation (arrows + focus trap with Tab)
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>): void => {
    const focusables = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (focusables.length === 0) return;

    const currentIndex = focusables.findIndex((el) => el === document.activeElement);

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === firstFocusable.current) {
        e.preventDefault();
        lastFocusable.current?.focus();
        return;
      }
      if (!e.shiftKey && document.activeElement === lastFocusable.current) {
        e.preventDefault();
        firstFocusable.current?.focus();
        return;
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1 + focusables.length) % focusables.length;
      focusables[nextIndex]?.focus();
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + focusables.length) % focusables.length;
      focusables[prevIndex]?.focus();
    }
  }, []);

  return (
    <div
      id={`${regionId}-panel`}
      role="region"
      aria-labelledby={anchorId}
      aria-describedby={descId}
      aria-hidden={!isOpen}
      className={[
        "absolute inset-x-0 top-full mt-1 z-50 transition-all duration-150",
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none",
      ].join(" ")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          ref={panelRef}
          className="w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        >
          <p id={descId} className="sr-only">
            Use arrow keys to move between items. Press Tab to cycle and Escape to close the menu.
          </p>

          <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it, idx) => (
              <Link
                key={it.label}
                href={it.href}
                className="group rounded-xl p-4 transition hover:bg-emerald-50 focus:outline-none focus-visible:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-200"
                onClick={onClose}
                onMouseDown={(e) => {
                  e.currentTarget.blur();
                }}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                tabIndex={0}
                aria-label={it.label}
              >
                <div className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-900">
                  {it.label}
                </div>
                {it.description ? (
                  <p className="mt-1 text-sm text-neutral-600">{it.description}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
