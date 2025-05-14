"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_alt_text?: string;
  category: string;
  slug: string;
  status: "draft" | "publish" | "scheduled";
};

interface HeroCarouselProps {
  articles: Article[] | undefined;
}

export const HeroCarousel = ({ articles = [] }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToNext = () => {
    if (articles.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex === articles.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const goToPrevious = () => {
    if (articles.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? articles.length - 1 : prevIndex - 1
      );
    }
  };

  const goToSlide = (index: number) => {
    if (articles.length > 0 && index < articles.length) {
      setCurrentIndex(index);
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    if (articles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === articles.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [articles]); // Depend on articles array, not articles.length

  if (articles.length === 0) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-gray-900">
        <div className="text-white">No featured articles available</div>
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
              alt={article.image_alt_text || article.title}
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