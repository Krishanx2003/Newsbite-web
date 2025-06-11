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
  slug: string;
  image_url: string;
  category: string;
  tags: string[];
}

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
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
        if (!data.article) {
          throw new Error('Article not found');
        }
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || []);
      } catch (err) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-container mx-auto px-6 lg:px-18 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push('/articles')}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              {article.category}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Action Bar */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-background/95 backdrop-blur-lg border rounded-full px-4 py-2 shadow-lg transition-all duration-300 ${showFloatingBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            284
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={`gap-2 ${isBookmarked ? 'text-primary' : ''}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            42
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-container mx-auto px-6 lg:px-18 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
            <span>/</span>
            <span>{article.category}</span>
            <span>/</span>
            <span>{article.tags[0]}</span>
          </div>
        </nav>

        {/* Category Badge */}
        <div className="mb-6 animate-fade-in">
          <Badge className="bg-primary text-white rounded-full px-4 py-1 text-sm font-medium">
            {article.category}
          </Badge>
        </div>

        {/* Headline */}
        <div className="max-w-reading mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Author Info */}
        <div className="max-w-reading mb-12 animate-fade-in">
          <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-2xl">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={article.author_avatar}
                alt={article.author_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{article.author_name}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Staff Writer</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatDate(article.date)}</span>
                <span>•</span>
                <span>{article.read_time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 animate-slide-up">
          <div className="aspect-video bg-muted rounded-2xl mb-4 overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.image_alt_text}
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {article.image_alt_text}
            <span className="text-muted-foreground/70 ml-2">Image: Newsbite</span>
          </p>
        </div>

        {/* Article Body */}
        <div className="max-w-reading prose prose-lg dark:prose-invert animate-fade-in">
          <div className="text-xl leading-relaxed mb-8 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>

        {/* Social Share */}
        <div className="max-w-reading my-16">
          <Separator className="mb-8" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Share this article</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[#1DA1F2] hover:bg-[#1DA1F2]/10">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#4267B2] hover:bg-[#4267B2]/10">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#0077B5] hover:bg-[#0077B5]/10">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>284 likes</span>
              <span>42 comments</span>
            </div>
          </div>
          <Separator className="mt-8" />
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-reading my-16">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Stay ahead of the curve</h3>
              <p className="text-muted-foreground mb-6">
                Get our weekly newsletter with the latest articles, industry insights, and expert analysis delivered directly to your inbox.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border bg-background/50 backdrop-blur-sm"
                />
                <Button className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                By subscribing, you agree to our privacy policy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-semibold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Card key={related.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <Image
                        src={related.image_url}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {related.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {related.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8" onClick={() => router.push('/articles')}>
                View All Articles
              </Button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}