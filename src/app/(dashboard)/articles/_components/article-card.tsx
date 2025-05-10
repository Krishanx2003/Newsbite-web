"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MessageSquare, Heart, Share2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author_name: string;
  author_avatar: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  tags: string[];
  image_url: string;
}

interface ArticleCardProps {
  article: Article;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, className = "" }) => {
  return (
    <article className={`rounded-lg overflow-hidden bg-card border shadow-sm animate-fade-in hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        <Link href={`/articles/${article.id}`} className="block image-hover-zoom">
          <div className="relative w-full h-48">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <span className="absolute top-3 left-3 inline-block px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-muted-foreground">
            {new Date(article.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <Link href={`/articles/${article.id}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-[#8B5CF6] transition-colors">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {article.subtitle}
        </p>
        
      </div>
    </article>
  );
};

export default ArticleCard;