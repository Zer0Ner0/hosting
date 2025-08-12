"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import type { Tag } from "@/types/Blog";

type Props = { tags: Tag[] };

export default function TagPills({ tags }: Props) {
  const { query } = useRouter();
  const active = typeof query.tag === "string" ? query.tag : "";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`text-sm px-3 py-1.5 rounded-full border ${!active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200"}`}
      >
        All
      </Link>
      {tags.map((t) => {
        const isActive = active === t.slug;
        return (
          <Link
            key={t.id}
            href={`/blog?tag=${encodeURIComponent(t.slug)}`}
            className={`text-sm px-3 py-1.5 rounded-full border ${isActive ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200"}`}
          >
            #{t.name}
          </Link>
        );
      })}
    </div>
  );
}
