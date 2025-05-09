"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/types/article";
import React from "react";
import ArticleCard from "./article-card";


interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
  className?: string;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ 
  articles, 
  loading = false, 
  className = "" 
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden bg-card border shadow-sm">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex items-center">
                <Skeleton className="h-3 w-16 mr-4" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <h3 className="text-lg font-medium text-muted-foreground">
          No articles found
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleGrid;