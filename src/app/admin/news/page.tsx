// src/app/admin/news/page.tsx
import Link from 'next/link';
import NewsList from './_components/NewsList';
import { createClient } from '@/lib/server';


export default async function NewsAdmin() {
  const supabase = createClient();
  const { data: news } = await (await supabase)
    .from('news')
    .select('*, category:categories(id, name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">News Articles</h2>
        <Link href="/admin/news/create" className="p-2 bg-blue-500 text-white rounded">
          Create News
        </Link>
      </div>
      <NewsList news={news || []} />
    </div>
  );
}