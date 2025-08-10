"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PostCard from "@/components/PostCard";
import TagPills from "@/components/TagPills";
import { getBlogPosts, getTags } from "@/lib/blog";
import type { BlogPostSummary, Tag } from "@/types/Blog";

export default function BlogIndexPage() {
  const { query } = useRouter();
  const tag = typeof query.tag === "string" ? query.tag : undefined;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getBlogPosts(tag), getTags()])
      .then(([p, t]) => {
        if (!mounted) return;
        setPosts(p);
        setTags(t);
        setError("");
      })
      .catch((e) => setError(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [tag]);

  return (
    <main className="container mx-auto px-4 md:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-gray-600 mt-1">Guides, tips and updates about domains & hosting.</p>
      </header>

      <div className="mb-8">
        <TagPills tags={tags} />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading posts…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </main>
  );
}
