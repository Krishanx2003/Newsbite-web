import ArticleGrid from "./articles/_components/ArticleGrid";
import { ArticlesByCategory } from "./articles/_components/ArticlesByCategory";
import { HeroCarousel } from "./articles/_components/HeroCarousel";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// Article type matching API schema
type Article = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  meta_description?: string;
  keywords?: string;
  author_name: string;
  author_avatar: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  tags: string[];
  image_url: string;
  image_alt_text?: string;
  status: "draft" | "publish" | "scheduled";
  scheduled_date?: string;
};

export default async function Home() {
  // Determine base URL based on environment
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL || "https://pop-roan.vercel.app"
      : "http://localhost:3000";

  // Construct absolute URL for the API
  const apiUrl = `${baseUrl}/api/articles?status=publish`;

  // Initialize articles as an empty array
  let articles: Article[] = [];
  try {
    const response = await fetch(apiUrl, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      console.error("Error fetching articles:", response.status, response.statusText);
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading articles: {response.statusText}</p>
        </div>
      );
    }

    const data = await response.json();
    articles = Array.isArray(data.articles) ? data.articles : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Unable to connect to the server. Please try again later.</p>
      </div>
    );
  }

  // Get unique categories from published articles
  const categories = Array.from(
    new Set(articles.map((article: Article) => article.category))
  );

  // Get featured articles for the hero carousel (first 3 published articles with images)
  const featuredArticles = articles
    .filter(
      (article: Article) =>
        article.status === "publish" && article.image_url && article.image_alt_text
    )
    .slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-16">
        <HeroCarousel articles={featuredArticles} />
      </section>

      {/* Personalization Card */}
      <section className="mb-16">
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-neon-blue/20 max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Sign in to personalize your feed
          </h3>
          <p className="text-gray-400 text-center mb-6">
            Get news tailored to your interests and never miss the stories that
            matter to you.
          </p>
          <Button className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white mb-2">
            Sign In
          </Button>
          <Button variant="outline" className="w-full">
            Pick Your Vibes
          </Button>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="gradient-text">Featured Stories</span>
          </h2>
          <Button
            variant="outline"
            className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
          >
            View All
          </Button>
        </div>

        {articles.length > 0 ? (
          <ArticleGrid articles={articles.slice(0, 6)} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}

        {articles.length > 6 && (
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
              articles={articles.filter(
                (article: Article) => article.category === category
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