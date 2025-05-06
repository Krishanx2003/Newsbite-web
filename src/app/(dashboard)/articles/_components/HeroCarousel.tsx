"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Type definitions based on your API schema
type Article = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  category: string;
  slug: string;
  status: "draft" | "publish" | "scheduled";
};

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch published articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/article');
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        // Filter to get at most 5 articles for the carousel
        const featuredArticles = data.slice(0, 5);
        setArticles(featuredArticles);
      } catch (err) {
        setError('Error loading featured articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance carousel with proper cleanup
  useEffect(() => {
    // Only set up interval if we have articles to show
    if (articles.length > 0) {
      // Create interval that advances to next slide every 5 seconds
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === articles.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      
      // Clean up interval on component unmount or when dependencies change
      return () => {
        clearInterval(interval);
      };
    }
  }, [articles.length]); // Only re-run if number of articles changes

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading featured articles...</div>
      </div>
    );
  }

  // Show error state
  if (error || articles.length === 0) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-gray-900">
        <div className="text-white">{error || 'No featured articles available'}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
      {/* Carousel items */}
      {articles.map((article, index) => (
        <div 
          key={article.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Background image with gradient overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${article.image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-off-black/60 to-off-black" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-start">
            <span className="tag bg-electric-purple mb-3">#{article.category}</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl leading-tight">
              {article.title}
            </h1>
            <button 
              className="btn btn-secondary px-6 py-3"
              onClick={() => window.location.href = `/articles/${article.id}`}
            >
              Read Now
            </button>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {articles.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};