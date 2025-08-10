// frontend/src/components/web_builder/TemplateCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Template } from "@/types/Builder";

interface Props {
    item: Template;
}

export default function TemplateCard({ item }: Props) {
    return (
        <article className="group rounded-2xl border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Image falls back gracefully if file is missing */}
                {item.thumbnail ? (
                    <Image
                        src={item.thumbnail}
                        alt={`${item.title} preview`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        priority={false}
                    />
                ) : null}
            </div>

            <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">
                        <Link href={`/builder?template=${encodeURIComponent(item.slug)}`} className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {item.title}
                        </Link>
                    </h3>
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${item.isFree ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                    >
                        {item.isFree ? "Free" : "Premium"}
                    </span>
                </div>

                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-gray-700">
                        {item.category}
                    </span>
                    {item.tags.slice(0, 2).map((t) => (
                        <span key={t} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-gray-500">
                            #{t}
                        </span>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                        href={`/builder/preview?template=${encodeURIComponent(item.slug)}`}
                        className="text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                        Preview
                    </Link>
                    <Link
                        href={`/hosting?template=${encodeURIComponent(item.slug)}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                        Use this template
                    </Link>
                </div>
            </div>
        </article>
    );
}
