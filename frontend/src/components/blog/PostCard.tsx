import Link from "next/link";
import type { BlogPostSummary } from "@/types/Blog";

type Props = { post: BlogPostSummary };

export default function PostCard({ post }: Props) {
  return (
    <article className="rounded-2xl shadow-sm ring-1 ring-black/5 bg-white overflow-hidden hover:shadow-md transition">
      {post.cover_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image} alt={post.title} className="w-full h-48 object-cover" />
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
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
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        {post.published_at ? (
          <p className="mt-1 text-xs text-gray-500">{new Date(post.published_at).toLocaleDateString()}</p>
        ) : null}
        <p className="mt-3 text-sm text-gray-700 line-clamp-3">{post.excerpt}</p>
        <div className="mt-4">
          <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-indigo-600 hover:underline">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
