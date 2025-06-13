'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (isAutoPlaying && news.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, news]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading news...</div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No news available</div>
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <div className="relative w-full h-[600px] bg-gray-900 overflow-hidden">
      {/* Main Featured Article */}
      <div className="relative w-full h-full">
        {currentNews.image_url && (
          <Image
            src={currentNews.image_url}
            alt={currentNews.title}
            fill
            className="object-cover transition-opacity duration-500"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            {currentNews.category && (
              <span className="inline-block px-3 py-1 mb-4 text-sm font-bold rounded-full bg-blue-600">
                {currentNews.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentNews.title}
            </h1>
            <p className="text-lg md:text-xl mb-4 line-clamp-2">
              {currentNews.content}
            </p>
            <span className="text-sm text-gray-300">
              {new Date(currentNews.published_at || currentNews.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={toggleAutoPlay}
          className={`p-2 rounded-full ${
            isAutoPlaying ? 'bg-red-600' : 'bg-black/50'
          } text-white hover:bg-black/70 transition-colors`}
        >
          {isAutoPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
