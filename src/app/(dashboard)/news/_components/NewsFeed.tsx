'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        variant={activeCategory === category ? 'default' : 'default'}
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

// Define News type
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
  image?: string;
  timeAgo?: string;
}

const NewsFeed: React.FC = () => {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('top');
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Device detection without hooks
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

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

        // Add timeAgo and fallback image
        const formattedNews = data.map((item) => ({
          ...item,
          timeAgo: new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          image: item.image || 'https://via.placeholder.com/400x300?text=News+Image',
        }));

        let filteredNews = formattedNews.filter((item) => item.is_published);

        if (activeCategory !== 'top') {
          filteredNews = filteredNews.filter((item) => item.category === activeCategory);
        }

        setNewsItems(filteredNews);
        setCurrentArticleIndex(0);

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
  }, [activeCategory]);

  const goToPreviousArticle = () => {
    if (currentArticleIndex > 0) {
      setAnimationDirection('right');
      setCurrentArticleIndex(currentArticleIndex - 1);
    }
  };

  const goToNextArticle = () => {
    if (currentArticleIndex < newsItems.length - 1) {
      setAnimationDirection('left');
      setCurrentArticleIndex(currentArticleIndex + 1);
    }
  };

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    if (touchStart !== null) {
      const distance = touchStart - currentX;
      setSwipeDirection(distance > 0 ? 'left' : 'right');
    }
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) {
      setIsSwiping(false);
      setSwipeDirection(null);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextArticle();
    } else if (isRightSwipe) {
      goToPreviousArticle();
    }

    setIsSwiping(false);
    setSwipeDirection(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentArticleIndex(0);
  };

  const handleDotClick = (index: number) => {
    const direction = index > currentArticleIndex ? 'left' : 'right';
    setAnimationDirection(direction);
    setCurrentArticleIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextArticle();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousArticle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentArticleIndex, newsItems.length]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading top stories...</span>
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

  const deviceType = getDeviceType();

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
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
        <div className="relative mt-6">
          <div
            className="relative overflow-hidden"
            {...(deviceType === 'mobile'
              ? {
                  onTouchStart,
                  onTouchMove,
                  onTouchEnd,
                }
              : {})}
          >
            {newsItems.length > 0 && (
              <div
                className={cn(
                  'transition-all duration-300 ease-in-out',
                  animationDirection === 'left' ? 'animate-slide-in-right' : '',
                  animationDirection === 'right' ? 'animate-slide-in-left' : '',
                )}
              >
                <NewsCard article={newsItems[currentArticleIndex]} />
              </div>
            )}
            {deviceType === 'mobile' && isSwiping && swipeDirection && (
              <div
                className={cn(
                  'absolute top-1/2 transform -translate-y-1/2 bg-primary/20 backdrop-blur-sm rounded-full p-4',
                  swipeDirection === 'left' ? 'right-4 animate-pulse' : 'left-4 animate-pulse',
                )}
              >
                {swipeDirection === 'left' ? (
                  <ChevronRightIcon className="h-6 w-6 text-primary" />
                ) : (
                  <ChevronLeftIcon className="h-6 w-6 text-primary" />
                )}
              </div>
            )}
          </div>
          {deviceType !== 'mobile' && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={goToPreviousArticle}
                disabled={currentArticleIndex === 0}
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Previous article"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToNextArticle}
                disabled={currentArticleIndex === newsItems.length - 1}
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Next article"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          <PaginationDots
            total={newsItems.length}
            current={currentArticleIndex}
            onChange={handleDotClick}
          />
        </div>
      )}
    </div>
  );
};

export default NewsFeed;