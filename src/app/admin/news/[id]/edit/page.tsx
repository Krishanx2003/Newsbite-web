import { createClient } from "@/lib/server";
import NewsForm from "../../_components/NewsForm";

export default async function EditNews({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: news } = await (await supabase)
    .from('news')
    .select('*, category:categories(id, name)')
    .eq('id', params.id)
    .single();
  const { data: categories } = await (await supabase).from('categories').select('*');

  if (!news) {
    return <div>News not found</div>;
  }

  return (
    <div>
      <h2 className="text-xl mb-4">Edit News Article</h2>
      <NewsForm news={news} categories={categories || []} />
    </div>
  );
}