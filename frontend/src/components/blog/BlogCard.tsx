import Link from 'next/link';
import { BlogPost } from '@/types/Blog';
import { fmtDateMY } from "@/lib/format";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card flex flex-col md:flex-row gap-5">
      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full md:w-56 h-40 object-cover rounded-xl"
        />
      ) : null}
      <div className="flex-1">
        <div className="text-xs text-gray-500">
          <time dateTime={post.published_at}>{fmtDateMY(post.published_at)}</time>
        </div>
        <h3 className="text-lg font-semibold mt-1">
          <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
        </h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags?.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 border">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
