import { createClient } from "@/lib/client";
import { ArticlesByCategory } from "./articles/_components/ArticlesByCategory";
import { HeroCarousel } from "./articles/_components/HeroCarousel";
import { Article } from "@/types/article";
import CategoryNav from "./articles/_components/CategoryNav";
import ArticleGrid from "./articles/_components/ArticleGrid";

export default async function Home() {
  const supabase = createClient();
  
  // Fetch published articles sorted by date
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "publish")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return <div className="text-center py-12">Error loading articles. Please try again later.</div>;
  }

  // Get unique categories
  const categories = Array.from(
    new Set(articles?.map((article) => article.category))
  );

  // Get featured articles for the hero carousel (first 3 articles with images)
  const featuredArticles = articles
    ?.filter(article => article.image_url) // Ensure articles have images
    .slice(0, 3) || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <HeroCarousel />
        </section>
      )}
    
      {/* Recent Articles Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Latest Articles</h2>
          {categories.length > 0 && (
            <CategoryNav categories={categories} />
          )}
        </div>
        
        {articles && articles.length > 0 ? (
          <ArticleGrid articles={articles.slice(0, 6)} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}
        
        {articles && articles.length > 6 && (
          <div className="mt-10 text-center">
            <a
              href="/articles"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              View All Articles
            </a>
          </div>
        )}
      </section>

      {/* Articles by Category Sections */}
      {categories.length > 0 && (
        <div className="space-y-20">
          {categories.map((category) => (
            <ArticlesByCategory
              key={category}
              category={category}
              articles={articles || []}
              // category={category.charAt(0).toUpperCase() + category.slice(1)}
              showViewAll={true}
              gridColumns="3"
            />
          ))}
        </div>
      )}
    </main>
  );
}