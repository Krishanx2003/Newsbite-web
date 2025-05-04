"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  subtitle: string;
 
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
    <Link href={`/articles/${article.id}`} passHref>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden ${className}`}>
        {/* Image with aspect ratio and lazy loading */}
        <div className="relative w-full h-52 md:h-60"> {/* Increased image height */}
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            loading="lazy"
            className="object-cover rounded-t-lg" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 line-clamp-2 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors duration-300">
            {article.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
            {article.subtitle}
          </p>

          {/* Date and read time */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3"> {/* Adjusted margin-top */}
            {new Date(article.date).toLocaleDateString()} <span className="text-gray-500 dark:text-gray-500">•</span> {article.read_time} min
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full"
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