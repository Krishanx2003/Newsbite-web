import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import CategoryForm from '../../_components/CategoryForm';

export default async function EditCategory({ params }: { params: { id: string } }) {
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
}