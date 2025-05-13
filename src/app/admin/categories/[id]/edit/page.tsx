import type { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import CategoryForm from '../../_components/CategoryForm';

interface PageProps {
  params: { id: string };
}

const EditCategory: NextPage<PageProps> = async ({ params }) => {
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
      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>
      <CategoryForm category={category} />
    </div>
  );
};

export default EditCategory;