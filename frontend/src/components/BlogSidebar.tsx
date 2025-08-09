'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function BlogSidebar({ currentTag = '' }: { currentTag?: string }) {
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    apiGet<string[]>('/api/blog/tags/').then(setTags).catch(() => setTags([]));
  }, []);

  return (
    <aside className="card sticky top-6">
      <h3 className="font-semibold">Tags</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => router.push(`/blog?tag=${encodeURIComponent(t)}`)}
            className={`text-xs px-2 py-1 rounded-full border ${currentTag===t ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </aside>
  );
}
