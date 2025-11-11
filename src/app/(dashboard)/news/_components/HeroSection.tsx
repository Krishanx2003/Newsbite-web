'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
  is_published: boolean;
}

export default function HeroSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const featuredNews = news.slice(0, 5);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        // Filter only published news and sort by published_at
        const publishedNews = data
          .filter((item: NewsItem) => item.is_published)
          .sort((a: NewsItem, b: NewsItem) =>
            new Date(b.published_at || b.created_at).getTime() -
            new Date(a.published_at || a.created_at).getTime()
          );
        setNews(publishedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && featuredNews.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredNews.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredNews.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const handleArticleClick = (id: number) => {
    // Implement your article navigation logic here
    // For example, redirect to a news detail page
    window.location.href = `/news/${id}`;
  };

  if (isLoading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-serif font-bold mb-4">Loading Breaking News...</h2>
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (featuredNews.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-serif font-bold mb-4">No News Available</h2>
        </div>
      </div>
    );
  }

  const currentNews = featuredNews[currentIndex];

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${currentNews.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
        <div className="max-w-3xl">
          {/* Breaking Badge and Category */}
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-red-600 hover:bg-red-700">BREAKING</Badge>
            {currentNews.category && (
              <span className="text-sm opacity-90">{currentNews.category}</span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-2xl md:text-4xl font-serif font-bold mb-4 leading-tight cursor-pointer hover:text-blue-300 transition-colors"
            onClick={() => handleArticleClick(currentNews.id)}
          >
            {currentNews.title}
          </h1>

          {/* Description */}
          <p className="text-lg opacity-90 mb-6 line-clamp-2">
            {currentNews.content}
          </p>

          {/* Time */}
          <p className="text-sm opacity-75">
            {new Date(currentNews.published_at || currentNews.created_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="ml-4 bg-black/20 hover:bg-black/40 text-white border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="mr-4 bg-black/20 hover:bg-black/40 text-white border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isAutoPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
}