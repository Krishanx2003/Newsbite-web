'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '@/context/BookmarkContext';
import { Card, CardContent } from '@/components/ui/card';
import NewsCard from '@/app/(dashboard)/news/_components/NewsCard';
// Define News type (aligned with database schema and NewsFeed)
interface News {
  id: string;
  title: string

  ;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_published: boolean;
  author_id: string;
  image_url: string | null;
  timeAgo?: string;
}

export default function BookmarksPage() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bookmarkedIds } = useBookmarks();

  // Fetch news and format timeAgo
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        const data: News[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid response: news is not an array');
        }

        // Format news items with timeAgo
        const formattedNews = data.map((item) => ({
          ...item,
          timeAgo: new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          image_url: item.image_url || null,
        }));

        // Filter only bookmarked and published articles
        const bookmarkedNews = formattedNews.filter(
          (item) => bookmarkedIds.includes(item.id) && item.is_published
        );

        setNewsItems(bookmarkedNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [bookmarkedIds]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading bookmarks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl flex items-center justify-center h-64">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Your Bookmarked Articles</h1>
        {newsItems.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">You haven’t bookmarked any articles yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}