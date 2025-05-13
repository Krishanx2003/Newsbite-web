import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import Link from 'next/link';
import type { NextPage } from 'next';

// Define the props type explicitly
interface CategoryPageProps {
  params: { id: string };
}

// Use NextPage type for the component
const CategoryPage: NextPage<CategoryPageProps> = async ({ params }) => {
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
      <p className="text-gray-600 mb-4">Created at: {new Date(category.created_at).toLocaleString()}</p>
      <Link href={`/admin/categories/${category.id}/edit`} className="text-blue-500 hover:text-blue-700">
        Edit Category
      </Link>
    </div>
  );
};

export default CategoryPage;