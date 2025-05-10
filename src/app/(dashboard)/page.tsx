import { createClient } from "@/lib/client";
import { ArticlesByCategory } from "./articles/_components/ArticlesByCategory";
import { HeroCarousel } from "./articles/_components/HeroCarousel";
import CategoryNav from "./articles/_components/CategoryNav";
import ArticleGrid from "./articles/_components/ArticleGrid";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react"; // Make sure to import the User icon

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

      {/* Personalization Card */}
    
    
      {/* Recent Articles Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="gradient-text">Featured Stories</span>
          </h2>
          <Button variant="outline" className="border-neon-pink text-neon-pink hover:bg-neon-pink/10">
            View All
          </Button>
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
              showViewAll={true}
              gridColumns="3"
            />
          ))}
        </div>
      )}

        <section className="mb-16">
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-neon-blue/20 max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Sign in to personalize your feed</h3>
          <p className="text-gray-400 text-center mb-6">
            Get news tailored to your interests and never miss the stories that matter to you.
          </p>
          <Button className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white mb-2">
            Sign In
          </Button>
          <Button variant="outline" className="w-full">
            Pick Your Vibes
          </Button>
        </div>
      </section>
    </main>
  );
}