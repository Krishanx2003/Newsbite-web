import ArticleGrid from "./articles/_components/ArticleGrid";
import { ArticlesByCategory } from "./articles/_components/ArticlesByCategory";
import { HeroCarousel } from "./articles/_components/HeroCarousel";
import { PersonalizationCard } from "./articles/_components/PersonalizationCard";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { createClient } from '@/lib/server';
import AdContainer from '@/components/AdContainer';

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
  // Initialize Supabase client
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Determine base URL based on environment
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL ||
      "https://www.newsbite.in/"
      : "http://localhost:3000";

  // Log the base URL for debugging
  console.log('Base URL for fetching articles:', baseUrl);

  // Construct absolute URL for the API
  const apiUrl = `${baseUrl}/api/articles?status=publish`;

  // Log the full API URL for debugging
  console.log('Fetching articles from:', apiUrl);

  // Initialize articles as an empty array
  let articles: Article[] = [];
  try {
    const response = await fetch(apiUrl, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      console.error("Error fetching articles:", response.status, response.statusText);
      return (
        <div className="text-center py-12 text-coral-500 font-inter">
          <p>Error loading articles: {response.statusText}</p>
        </div>
      );
    }

    const data = await response.json();
    articles = Array.isArray(data.articles) ? data.articles : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="text-center py-12 text-coral-500 font-inter">
        <p>Unable to connect to the server. Please try again later.</p>
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-off-white dark:bg-near-black text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="mb-16">
        <HeroCarousel
          articles={featuredArticles}
        />
      </section>

      {/* Personalization Card */}
      {/* <PersonalizationCard user={user} /> */}

      {/* Recent Articles Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-200">
            Featured Stories
          </h2>
          <Button
            variant="outline"
            className="border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-fredoka rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105"
          >
            View All
          </Button>
        </div>

        {articles.length > 0 ? (
          <>
            <ArticleGrid
              articles={articles.slice(0, 3)}
            />

            {/* Middle Ad - Only show if we have content */}
            {articles.length >= 3 && (
              <AdContainer
                position="middle"
                className="my-8"
                hasContent={articles.length >= 3}
              />
            )}

            <ArticleGrid
              articles={articles.slice(3, 6)}
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-700 dark:text-gray-300 font-inter">
            <p>No articles found</p>
          </div>
        )}

        {articles.length > 6 && (
          <div className="mt-10 text-center">
            <a
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-600/80 text-white font-fredoka rounded-md transition-transform duration-200 hover:scale-105"
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