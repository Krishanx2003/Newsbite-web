import { createClient } from '@/lib/server';
import Link from 'next/link';
import CategoryList from './_components/CategoryList';


export default async function CategoriesAdmin() {
  const supabase = createClient();
  const { data: categories } = await (await supabase)
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Categories</h2>
        <Link href="/admin/categories/create" className="p-2 bg-blue-500 text-white rounded">
          Create Category
        </Link>
      </div>
      <CategoryList categories={categories || []} />
    </div>
  );
}