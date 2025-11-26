import ArticleGrid from "./articles/_components/ArticleGrid";
import { ArticlesByCategory } from "./articles/_components/ArticlesByCategory";
import { HeroCarousel } from "./articles/_components/HeroCarousel";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/server';
import { Article } from "@/types/article";
import Link from "next/link";

export default async function Home() {
  // Initialize Supabase client
  const supabase = await createClient();

  // Fetch published articles directly from Supabase
  const { data: articlesData, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return (
      <div className="text-center py-12 text-coral-500 font-inter">
        <p>Unable to connect to the server. Please try again later.</p>
      </div>
    );
  }

  const articles: Article[] = articlesData || [];

  // Get unique categories from published articles
  const categories = Array.from(
    new Set(articles.map((article) => article.category))
  );

  // Get featured articles for the hero carousel (first 3 published articles with images)
  const featuredArticles = articles
    .filter(
      (article) =>
        article.image_url && article.image_alt_text
    )
    .slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-off-white dark:bg-near-black text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="mb-16">
        <HeroCarousel
          articles={featuredArticles}
        />
      </section>

      {/* Recent Articles Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-200">
            Featured Stories
          </h2>
          <Button
            variant="outline"
            className="border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-fredoka rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105"
            asChild
          >
            <Link href="/articles">View All</Link>
          </Button>
        </div>

        {articles.length > 0 ? (
          <>
            <ArticleGrid
              articles={articles.slice(0, 3)}
            />

            {articles.length > 3 && (
              <ArticleGrid
                articles={articles.slice(3, 6)}
                className="mt-6"
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-700 dark:text-gray-300 font-inter">
            <p>No articles found</p>
          </div>
        )}

        {articles.length > 6 && (
          <div className="mt-10 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-600/80 text-white font-fredoka rounded-md transition-transform duration-200 hover:scale-105"
            >
              View All Articles
            </Link>
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
              articles={articles.filter(
                (article) => article.category === category
              )}
              showViewAll={true}
              gridColumns="3"
            />
          ))}
        </div>
      )}
    </main>
  );
}