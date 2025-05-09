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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
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
    <div className="relative w-full h-[60vh] md:h-[60vh]">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
              <div className={`inline-block mb-3 px-3 py-1 text-xs font-medium rounded-full bg-white text-black`}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-white/80 mb-4 hidden md:block">{article.subtitle}</p>
              <a 
                href={`/articles/${article.id}`}
                className="mt-4 inline-block bg-white text-black px-4 py-2 rounded font-medium hover:bg-opacity-90 transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};