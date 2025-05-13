
import { createClient } from '@/lib/server';
import CategoryForm from '../_components/CategoryForm';

export default async function EditCategory({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <h2 className="text-xl mb-4">Edit Category</h2>
      <CategoryForm category={category} />
    </div>
  );
}