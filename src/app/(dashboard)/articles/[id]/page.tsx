'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Bookmark, Share2, MessageCircle, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/client';
import AdContainer from '@/components/AdContainer';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  image_url: string;
  image_alt_text: string;
  category: string;
  tags: string[];
  date: string;
  read_time: string;
  author_name: string;
  author_avatar: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image_url: string;
  category: string;
  tags: string[];
}

interface LatestArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: string;
  date: string;
  read_time: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  published_at: string | null;
  image_url: string | null;
  is_published: boolean;
}

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<LatestArticle[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingBar(scrollPosition > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id || typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('Invalid article ID');
        }

        const response = await fetch(`/api/articles?id=${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        if (!data.article) {
          throw new Error('Article not found');
        }
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || []);

        // Fetch latest news
        const newsResponse = await fetch('/api/news');
        if (!newsResponse.ok) {
          throw new Error(`Failed to fetch news: ${newsResponse.status}`);
        }
        const newsData = await newsResponse.json();
        // Filter only published news and take the latest 2
        const publishedNews = newsData
          .filter((news: News) => news.is_published)
          .sort((a: News, b: News) => 
            new Date(b.published_at || b.created_at).getTime() - 
            new Date(a.published_at || a.created_at).getTime()
          )
          .slice(0, 2);
        setLatestNews(publishedNews);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("Link copied!", {
        description: "Article link has been copied to your clipboard.",
      });
    } catch (err) {
      console.log('Failed to copy link');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast(isLiked ? "Removed from likes" : "Added to likes", {
      description: isLiked ? "Article removed from your likes." : "Thanks for liking this article!",
    });
  };

  const handleSave = () => {
    setIsBookmarked(!isBookmarked);
    toast(isBookmarked ? "Removed from saved" : "Saved for later", {
      description: isBookmarked ? "Article removed from your reading list." : "Article saved to your reading list.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-8 bg-card rounded-xl shadow-lg text-destructive max-w-md text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p>{error || 'Article not found'}</p>
          <Link
            href="/articles"
            className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : article ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Top Ad - Only show if we have article content */}
            <AdContainer 
              position="top" 
              className="mb-8" 
              hasContent={!!article.content}
            />

            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            {/* Article content */}
            <div className="prose max-w-none">
              {article.content}
            </div>

            {/* Bottom Ad - Only show if we have article content */}
            <AdContainer 
              position="bottom" 
              className="mt-8" 
              hasContent={!!article.content}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            {/* Sidebar Ad - Only show if we have related content */}
            <AdContainer 
              position="sidebar" 
              className="mb-8" 
              hasContent={relatedArticles.length > 0}
            />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <div key={related.id} className="border-b pb-4 last:border-0">
                      <h3 className="font-medium mb-2">{related.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {related.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </div>
  );
}