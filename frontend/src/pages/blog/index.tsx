import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { BlogPost } from '@/types/Blog';
import BlogCard from '@/components/BlogCard';
import BlogSidebar from '@/components/BlogSidebar';

type Props = { posts: BlogPost[]; tag?: string; q?: string; page: number; count: number };

export default function BlogIndex({ posts, tag, q, page, count }: Props) {
  const totalPages = Math.max(1, Math.ceil(count / 10));
  return (
    <>
      <Head>
        <title>Blog | AmirHost</title>
        <meta name="description" content="Articles about hosting, WordPress, WooCommerce, and performance." />
      </Head>
      <section className="container py-12">
        <h1 className="text-3xl font-bold">Blog</h1>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-6">
            {posts.map((post) => <BlogCard key={post.id} post={post} />)}
            <Pagination page={page} totalPages={totalPages} q={q} tag={tag} />
          </div>
          <div>
            <SearchBox q={q} tag={tag} />
            <div className="mt-6">
              <BlogSidebar currentTag={tag} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SearchBox({ q = '', tag = '' }: { q?: string, tag?: string }) {
  return (
    <form className="card" method="get">
      <h3 className="font-semibold">Search</h3>
      <input
        name="search"
        className="mt-3 w-full border rounded-xl px-3 py-2"
        placeholder="Search articles..."
        defaultValue={q}
      />
      <input
        name="tag"
        className="mt-2 w-full border rounded-xl px-3 py-2"
        placeholder="Tag (optional)"
        defaultValue={tag}
      />
      <button className="btn mt-3" type="submit">Apply</button>
    </form>
  );
}

function Pagination({ page, totalPages, q = '', tag = '' }: { page: number; totalPages: number; q?: string; tag?: string }) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const qs = (p: number) => {
    const s = new URLSearchParams();
    if (q) s.set('search', q);
    if (tag) s.set('tag', tag);
    s.set('page', String(p));
    return s.toString();
  };
  return (
    <div className="flex items-center justify-between">
      <a className={`btn ${page<=1 ? 'pointer-events-none opacity-50' : ''}`} href={`?${qs(prev)}`}>Previous</a>
      <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
      <a className={`btn ${page>=totalPages ? 'pointer-events-none opacity-50' : ''}`} href={`?${qs(next)}`}>Next</a>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
  const { tag, search, page = '1' } = ctx.query;
  const params = new URLSearchParams();
  if (tag && typeof tag === 'string') params.set('tag', tag);
  if (search && typeof search === 'string') params.set('search', search);
  if (page && typeof page === 'string') params.set('page', page);
  const url = `${base}/api/blog/posts/?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  const results = Array.isArray(data) ? data : (data.results || []);
  const count = typeof data.count === 'number' ? data.count : results.length;
  return { props: { posts: results, tag: tag || '', q: search || '', page: Number(page), count } };
};
