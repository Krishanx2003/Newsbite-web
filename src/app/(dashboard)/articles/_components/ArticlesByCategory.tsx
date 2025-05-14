"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ArticleCard from "./article-card";
import { Article } from "@/types/article"; // Update this import path

interface ArticlesByCategoryProps {
  category: string;
  articles: Article[];
  limit?: number;
  className?: string;
  showViewAll?: boolean;
  gridColumns?: "2" | "3" | "4";
}

export function ArticlesByCategory({
  category,
  articles,
  limit = 3,
  className = "",
  showViewAll = true,
  gridColumns = "3",
}: ArticlesByCategoryProps) {
  const filteredArticles = articles
    .filter((article) => article.category?.toLowerCase() === category.toLowerCase())
    .slice(0, limit);

  if (filteredArticles.length === 0) return null;

  const gridClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-4",
  }[gridColumns];

  return (
    <section className={`mb-20 ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-200 capitalize">
          {category}
        </h2>
        {showViewAll && (
          <Link
            href={`/articles?category=${encodeURIComponent(category)}`}
            className="text-coral-500 hover:text-coral-500/80 font-inter font-medium flex items-center transition-transform duration-200 hover:scale-105"
            aria-label={`View all ${category} articles`}
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>

      <div className={`grid grid-cols-1 gap-6 ${gridClass}`}>
        {filteredArticles.map((article) => (
          <ArticleCard
            key={`${category}-${article.id}`}
            article={article as Article}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 max-w-sm mx-auto transition-opacity duration-300 hover:shadow-lg"
          />
        ))}
      </div>
    </section>
  );
}