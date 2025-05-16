'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NewsCard from '@/components/NewsCard';
import { BookmarkIcon, Share2Icon, ChevronLeftIcon } from 'lucide-react';
import { createClient } from '@/lib/client';
import sanitizeHtml from 'sanitize-html';
import { motion } from 'framer-motion';
import { useTextSize } from '@/context/TextSizeContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

export default function NewsDetailPage() {
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();
  const { textSize } = useTextSize() as { textSize: keyof typeof textSizeClasses };
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Fetch news item and related news
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id || typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('Invalid news ID');
        }

        const { data, error } = await supabase
          .from('news')
          .select('id, title, content, category, created_at, updated_at, published_at, is_published, author_id, image_url')
          .eq('id', id)
          .single();

        if (error || !data) {
          throw new Error('News not found');
        }

        if (!data.is_published) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || user.id !== data.author_id) {
            throw new Error('News not published');
          }
        }

        // Format timeAgo
        const formattedNews = {
          ...data,
          timeAgo: new Date(data.published_at || data.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          image_url: data.image_url || null,
        };

        setNews(formattedNews);

        // Fetch related news with the same category
        if (data.category) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('news')
            .select('id, title, content, category, created_at, updated_at, published_at, is_published, author_id, image_url')
            .eq('category', data.category)
            .neq('id', data.id)
            .eq('is_published', true)
            .limit(3);

          if (!relatedError && relatedData) {
            const formattedRelatedNews = relatedData.map((item) => ({
              ...item,
              timeAgo: new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              image_url: item.image_url || null,
            }));
            setRelatedNews(formattedRelatedNews);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id, supabase]);

  // Handle bookmark click
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(news!.id);
    toast.success(
      isBookmarked(news!.id) ? 'Removed from bookmarks' : 'Added to bookmarks',
      {
        description: news!.title,
        duration: 2000,
      }
    );
  };

  // Handle share click
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: news!.title,
        text: news!.content,
        url: `/news/${news!.id}`,
      }).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      toast.info('Share functionality would open sharing options here', {
        duration: 2000,
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl flex items-center justify-center h-64">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Article Not Available
          </h2>
          <p className="text-muted-foreground mb-6">{error || 'News not found'}</p>
          <Button
            onClick={() => router.push('/news')}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </div>
      </div>
    );
  }

  const sanitizedContent = sanitizeHtml(news.content, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'img', 'blockquote'],
    allowedAttributes: { a: ['href', 'target'], img: ['src', 'alt'] },
  });

  const imageSrc = (news.image_url || 'https://via.placeholder.com/1200x800?text=News+Image').trimStart();
  const bookmarked = isBookmarked(news.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/news')}
            className="flex items-center text-muted-foreground hover:text-foreground"
            aria-label="Go back to news"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to News
          </Button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmarkClick}
              className={cn(
                'p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background',
                bookmarked ? 'text-primary' : 'text-muted-foreground',
              )}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <BookmarkIcon size={16} className={bookmarked ? 'fill-primary' : ''} />
            </button>
            <button
              onClick={handleShareClick}
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background text-muted-foreground"
              aria-label="Share article"
            >
              <Share2Icon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Article Header */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="secondary" className="bg-primary/90 text-white">
                {news.category || 'General'}
              </Badge>
              <span className="text-xs text-muted-foreground">{news.timeAgo}</span>
            </div>
            <h1 className={cn('text-3xl md:text-4xl font-bold mb-4', textSizeClasses[textSize])}>
              {news.title}
            </h1>
          </motion.div>

          {/* Featured Image */}
          <motion.div variants={itemVariants} className="relative h-64 sm:h-96 mb-6 overflow-hidden rounded-xl">
            <Image
              src={imageSrc}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              width={1200}
              height={800}
              priority
            />
          </motion.div>

          {/* Article Content */}
          <motion.article variants={itemVariants} className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div
                  className={cn('prose prose-blue max-w-none', textSizeClasses[textSize])}
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              </CardContent>
            </Card>
          </motion.article>

          {/* Related Articles */}
          {relatedNews.length > 0 && (
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-xl font-bold mb-4">Related Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedNews.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <NewsCard article={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      
    </div>
  );
}