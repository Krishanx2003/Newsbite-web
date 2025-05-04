// app/page.tsx

import { createClient } from "@/lib/client";
import { ArticlesByCategory } from "./_components/ArticlesByCategory";

export default async function Home() {
  const supabase = createClient();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    // You might want to handle this error more gracefully
    return <div>Error loading articles</div>;
  }

  // Get unique categories
  const categories = Array.from(
    new Set(articles?.map((article) => article.category))
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-serif mb-4">Welcome to Our Blog</h1>
        <p className="text-xl text-gray-600">
          Discover insightful articles on various topics
        </p>
      </section>

      {/* Articles by Category */}
      {categories.map((category) => (
        <ArticlesByCategory
          key={category}
          category={category}
          articles={articles || []}
        />
      ))}
    </main>
  );
}