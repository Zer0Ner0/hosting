// frontend/src/components/web_builder/TemplateGrid.tsx
"use client";

import { useState } from "react";
import type { Template } from "@/types/Builder";
import { TEMPLATES } from "./templates.data";
import TemplateFilters from "./TemplateFilters";
import TemplateCard from "./TemplateCard";

export default function TemplateGrid() {
    const [visible, setVisible] = useState<Template[]>(TEMPLATES);

    return (
        <section id="templates" className="container mx-auto px-4 md:px-6 py-14 md:py-20">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Start from a template
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Pick a template, then tailor sections to your brand.
                    </p>
                </div>
                <div className="text-sm text-gray-500 hidden md:block">
                    {visible.length} of {TEMPLATES.length} templates
                </div>
            </div>

            <div className="mt-6">
                <TemplateFilters data={TEMPLATES} onChange={setVisible} />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((t) => (
                    <TemplateCard key={t.id} item={t} />
                ))}
            </div>

            <p className="mt-6 text-sm text-gray-500 md:hidden">{visible.length} of {TEMPLATES.length} templates</p>
        </section>
    );
}
