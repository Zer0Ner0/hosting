// frontend/src/components/web_builder/TemplateFilters.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import type { Template, TemplateCategory } from "@/types/Builder";

type SortBy = "popularity" | "newest" | "az";

const CATEGORIES: (TemplateCategory | "All")[] = [
    "All",
    "Business",
    "Portfolio",
    "Blog",
    "E-Commerce",
    "Landing",
];

interface Props {
    data: Template[];
    onChange: (visible: Template[]) => void;
}

export default function TemplateFilters({ data, onChange }: Props) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
    const [freeOnly, setFreeOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy>("popularity");

    const filtered = useMemo(() => {
        let list = data.slice();

        if (category !== "All") {
            list = list.filter((t) => t.category === category);
        }

        if (freeOnly) {
            list = list.filter((t) => t.isFree);
        }

        if (query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(q))
            );
        }

        switch (sortBy) {
            case "newest":
                list.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
            case "az":
                list.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                list.sort((a, b) => b.popularity - a.popularity);
        }

        return list;
    }, [data, query, category, freeOnly, sortBy]);

    // push changes up
    useEffect(() => {
        onChange(filtered);
    }, [filtered, onChange]);

    return (
        <div className="rounded-2xl border p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-3">
                    <label htmlFor="template-search" className="sr-only">
                        Search templates
                    </label>
                    <input
                        id="template-search"
                        type="search"
                        placeholder="Search templates (e.g., business, blog)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full md:max-w-sm rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div role="tablist" aria-label="Filter by category" className="hidden md:flex gap-2">
                        {CATEGORIES.map((c) => {
                            const active = c === category;
                            return (
                                <button
                                    key={c}
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setCategory(c)}
                                    className={`rounded-xl px-3 py-1.5 text-sm border ${active ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50"
                                        }`}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={freeOnly}
                            onChange={(e) => setFreeOnly(e.target.checked)}
                        />
                        Free only
                    </label>

                    <label className="text-sm">
                        <span className="mr-2">Sort</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            className="rounded-xl border px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Sort templates"
                        >
                            <option value="popularity">Popularity</option>
                            <option value="newest">Newest</option>
                            <option value="az">A–Z</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Mobile categories */}
            <div className="mt-3 flex gap-2 overflow-x-auto md:hidden pb-1" role="tablist" aria-label="Filter by category">
                {CATEGORIES.map((c) => {
                    const active = c === category;
                    return (
                        <button
                            key={c}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setCategory(c)}
                            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-sm border ${active ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50"
                                }`}
                        >
                            {c}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
