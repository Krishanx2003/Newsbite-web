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
    <article
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 max-w-sm mx-auto transition-opacity duration-300 hover:shadow-lg ${className}`}
    >
      <div className="relative">
        <Link href={`/articles/${article.id}`} className="block">
          <div className="relative w-full h-36">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              loading="lazy"
              className="object-cover rounded-md transition-transform duration-200 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-inter font-medium uppercase text-blue-600 dark:text-blue-400">
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
          <span className="text-xs font-inter text-gray-500 dark:text-gray-400">
            {new Date(article.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <Link href={`/articles/${article.id}`}>
          <h3 className="text-xl font-montserrat font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
        </Link>

        <p className="text-base font-inter text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {article.subtitle}
        </p>

        <div className="flex space-x-2">
          {article.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs font-fredoka px-2 py-1 rounded bg-teal-500 text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;