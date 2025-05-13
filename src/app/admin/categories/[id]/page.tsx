import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import Link from 'next/link';

// Define the props type with params as a Promise
interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Resolve the params Promise
  const { id } = await params;

  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
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
}