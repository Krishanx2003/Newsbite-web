'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

// Mock CategoryTabs and PaginationDots (replace with actual implementations)
const CategoryTabs: React.FC<{
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}> = ({ categories, activeCategory, onSelectCategory }) => (
  <div className="flex space-x-2 overflow-x-auto pb-2">
    {categories.map((category) => (
      <Button
        key={category}
        variant={activeCategory === category ? 'default' : 'outline'}
        onClick={() => onSelectCategory(category)}
        className="whitespace-nowrap"
      >
        {category}
      </Button>
    ))}
  </div>
);

const PaginationDots: React.FC<{
  total: number;
  current: number;
  onChange: (index: number) => void;
}> = ({ total, current, onChange }) => (
  <div className="flex justify-center space-x-2 mt-4">
    {[...Array(total)].map((_, i) => (
      <button
        key={i}
        onClick={() => onChange(i)}
        className={cn(
          'w-2 h-2 rounded-full',
          i === current ? 'bg-primary' : 'bg-gray-300',
        )}
      />
    ))}
  </div>
);

// Define News type (aligned with database schema)
interface News {
  id: string;
  title: string;
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

const NewsFeed: React.FC = () => {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('top');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

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

        let filteredNews = formattedNews.filter((item) => item.is_published);

        // Get category from URL query parameter
        const urlCategory = searchParams.get('category')?.toLowerCase() || 'top';
        setActiveCategory(urlCategory);

        if (urlCategory !== 'top') {
          filteredNews = filteredNews.filter((item) => item.category?.toLowerCase() === urlCategory);
        }

        setNewsItems(filteredNews);

        const uniqueCategories = [
          'top',
          ...new Set(formattedNews.filter((item) => item.category).map((item) => item.category!)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Update URL without reloading
    const url = categoryId === 'top' ? '/news' : `/news?category=${categoryId.toLowerCase()}`;
    window.history.pushState({}, '', url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading top stories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl flex items-center justify-center h-64">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
      />
      {newsItems.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No articles found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {newsItems.map((article) => (
            <div key={article.id} className="transform transition-all duration-300 hover:scale-[1.02]">
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;