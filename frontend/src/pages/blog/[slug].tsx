"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { getBlogPost, getRelatedPosts } from "@/lib/blog";
import type { BlogPost, BlogPostSummary } from "@/types/Blog";
import PostCard from "@/components/blog/PostCard";

export default function BlogDetailPage() {
  const { query } = useRouter();
  const slug = typeof query.slug === "string" ? query.slug : "";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPostSummary[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    Promise.all([getBlogPost(slug), getRelatedPosts(slug)])
      .then(([p, r]) => {
        if (!mounted) return;
        setPost(p);
        setRelated(r);
      })
      .catch((e) => setError(e?.message ?? "Failed to load"));
    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <main className="container mx-auto px-4 md:px-6 py-10">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : !post ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <>
          <nav className="text-sm mb-6">
            <Link href="/blog" className="text-gray-600 hover:underline">
              ← Back to blog
            </Link>
          </nav>

          <article className="prose max-w-none prose-indigo">
            <h1>{post.title}</h1>
            <p className="text-sm text-gray-500">
              {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""} · By{" "}
              {post.author.full_name}
            </p>

            {post.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image} alt={post.title} className="w-full rounded-xl shadow mt-4 mb-6" />
            ) : null}

            <ReactMarkdown>{post.content}</ReactMarkdown>

            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/blog?tag=${encodeURIComponent(t.slug)}`}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Related posts</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
