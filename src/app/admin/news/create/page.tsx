import { createClient } from "@/lib/server";
import NewsForm from "../_components/NewsForm";

export default async function CreateNews() {
  const supabase = createClient();
  const { data: categories } = await (await supabase).from('categories').select('*');

  return (
    <div>
      <h2 className="text-xl mb-4">Create News Article</h2>
      <NewsForm categories={categories || []} />
    </div>
  );
}