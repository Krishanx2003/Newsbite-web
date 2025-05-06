// app/page.tsx

import { createClient } from "@/lib/client";
import { ArticlesByCategory } from "./articles/_components/ArticlesByCategory";
import { HeroCarousel } from "./articles/_components/HeroCarousel";


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
      <HeroCarousel />
    
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