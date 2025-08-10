// frontend/src/components/web_builder/SectionToggles.tsx
"use client";

import type { SectionId, TemplateSection } from "@/types/Builder";

interface Props {
    sections: TemplateSection[];
    value: Record<SectionId, boolean>;
    onChange: (next: Record<SectionId, boolean>) => void;
}

export default function SectionToggles({ sections, value, onChange }: Props) {
    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="rounded-2xl border p-4">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-700">
                    Sections
                </h2>
                <ul className="mt-3 space-y-2">
                    {sections.map((s) => {
                        const checked = value[s.id] ?? false;
                        return (
                            <li key={s.id} className="flex items-center justify-between gap-3">
                                <label htmlFor={`sec-${s.id}`} className="text-sm">
                                    {s.label}
                                </label>
                                <input
                                    id={`sec-${s.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={checked}
                                    onChange={(e) =>
                                        onChange({ ...value, [s.id]: e.target.checked })
                                    }
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
