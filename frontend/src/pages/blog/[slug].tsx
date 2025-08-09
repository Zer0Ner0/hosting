import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { BlogPost } from '@/types/Blog';
import { fmtDateMY } from "@/lib/format";

type Props = { post: BlogPost; related: BlogPost[] };

export default function BlogDetail({ post, related }: Props) {
  return (
    <>
      <Head>
        <title>{post.title} | AmirHost</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <article className="container py-12 max-w-3xl">
        <div className="text-sm text-gray-500">
          <time dateTime={post.published_at}>{fmtDateMY(post.published_at)}</time> · {post.author_name}
        </div>
        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
        {post.cover_image_url ? (
          <img src={post.cover_image_url} alt={post.title} className="rounded-2xl mt-6 w-full object-cover" />
        ) : null}
        <p className="mt-6 text-gray-700">{post.excerpt}</p>
        <div className="prose max-w-none mt-8" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags?.map((t) => (
            <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 border">{t}</a>
          ))}
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-semibold">Related posts</h3>
            <ul className="list-disc list-inside mt-3">
              {related.map(r => (
                <li key={r.id}><a className="hover:underline" href={`/blog/${r.slug}`}>{r.title}</a></li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
  const { slug } = ctx.query;
  const postRes = await fetch(`${base}/api/blog/posts/${slug}/`);
  if (postRes.status !== 200) return { notFound: true };
  const post = await postRes.json();
  const relRes = await fetch(`${base}/api/blog/posts/${slug}/related/`);
  const related = relRes.ok ? await relRes.json() : [];
  return { props: { post, related } };
};
