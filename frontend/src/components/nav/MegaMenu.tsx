import Link from "next/link";
import * as React from "react";

export type MegaMenuItem = {
  label: string;
  href: string;
  description?: string;
};

type MegaMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorId: string; // Used for aria-controls on trigger
  items: MegaMenuItem[];
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

export default function MegaMenu({ isOpen, onClose, anchorId, items, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Close on Escape
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) onClose();
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      id={anchorId}
      role="region"
      aria-label="Hosting menu"
      className={[
        "absolute inset-x-0 top-full mt-1 z-50 transition-all duration-150", // smaller gap reduces missed hover
        isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
      ].join(" ")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          ref={panelRef}
          className="w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        >
          <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                className="group rounded-xl p-4 transition hover:bg-emerald-50 focus:bg-emerald-50 outline-none"
                onClick={onClose}
              >
                <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700">
                  {it.label}
                </div>
                {it.description ? (
                  <p className="mt-1 text-sm text-gray-600">{it.description}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
