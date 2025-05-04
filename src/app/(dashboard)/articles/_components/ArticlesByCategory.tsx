// components/ArticlesByCategory.tsx
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
    <section className={`mb-12 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif capitalize">{category}</h2>
        {showViewAll && (
          <Link
            href={`/articles?category=${encodeURIComponent(category)}`}
            className="text-orange-600 hover:text-orange-700 flex items-center transition-colors"
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
            article={article as Article} // Explicit type assertion if needed
          />
        ))}
      </div>
    </section>
  );
}