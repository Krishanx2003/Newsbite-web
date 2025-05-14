
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
  }, [articles]);

  if (articles.length === 0) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-near-black dark:bg-near-black">
        <div className="text-gray-200 font-inter">No featured articles available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[60vh]">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={article.image_url}
              alt={article.image_alt_text || article.title}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
              <div
                className={`inline-block mb-3 px-3 py-1 text-xs font-fredoka font-medium rounded-full bg-teal-500 text-white`}
              >
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </div>
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-200 mb-3 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-base font-inter text-gray-300 mb-4 hidden md:block">
                {article.subtitle}
              </p>
              <a
                href={`/articles/${article.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-fredoka hover:bg-blue-600/80 transition-transform duration-200 hover:scale-105"
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-600/50 hover:bg-blue-600/70 text-white p-2 rounded-full transition-transform duration-200 hover:scale-105 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600/50 hover:bg-blue-600/70 text-white p-2 rounded-full transition-transform duration-200 hover:scale-105 z-10"
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
              index === currentIndex ? "bg-blue-600 w-6" : "bg-gray-200/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
