"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

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
  // Create unique tags by combining with article ID
  const uniqueTags = Array.from(new Set(article.tags)).slice(0, 3);

  return (
    <Link href={`/articles/${article.id}`} passHref>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden ${className}`}>
        {/* Image with aspect ratio and lazy loading */}
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
        
        <div className="p-6">
          <h2 className="text-xl font-bold line-clamp-2">{article.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {article.subtitle}
          </p>
          
          {/* Author info */}
          <div className="flex items-center mt-4">
            <div className="relative w-8 h-8">
              <Image
                src={article.author_avatar}
                alt={article.author_name}
                loading="lazy"
                fill
                className="rounded-full"
              />
            </div>
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {article.author_name}
            </span>
          </div>
          
          {/* Date and read time */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {new Date(article.date).toLocaleDateString()} · {article.read_time}
          </p>
          
          {/* Tags - now with unique keys */}
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueTags.map((tag) => (
              <span
                key={`${article.id}-${tag}`}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;