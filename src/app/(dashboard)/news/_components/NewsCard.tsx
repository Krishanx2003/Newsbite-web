'use client';

import Link from 'next/link';
import { BookmarkIcon, Share2Icon, Clock, User, Hash } from 'lucide-react';
import { useTextSize } from '@/context/TextSizeContext';
import { useBookmarks } from '@/context/BookmarkContext';
import Image from 'next/image';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Define News type (aligned with database schema)
interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  published_at: string | null;
  image_url: string | null;
  timeAgo?: string;
  author?: string;
  wordCount?: number;
}

interface NewsCardProps {
  article: News;
}

const categoryColors = {
  world: 'bg-green-100 text-green-800 border-green-200',
  tech: 'bg-purple-100 text-purple-800 border-purple-200',
  business: 'bg-orange-100 text-orange-800 border-orange-200',
  entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
  health: 'bg-red-100 text-red-800 border-red-200',
  general: 'bg-blue-100 text-blue-800 border-blue-200'
};

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { textSize } = useTextSize() as { textSize: keyof typeof textSizeClasses };
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(article.id);
    toast.success(
      isBookmarked(article.id) ? 'Removed from bookmarks' : 'Added to bookmarks',
      {
        description: article.title,
        duration: 2000,
      }
    );
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content,
        url: `/news/${article.id}`,
      }).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      toast.info('Share functionality would open sharing options here', {
        duration: 2000,
      });
    }
  };

  const bookmarked = isBookmarked(article.id);
  const imageSrc = (article.image_url || 'https://via.placeholder.com/400x300?text=News+Image').trimStart();
  const categoryColorClass = categoryColors[article.category?.toLowerCase() as keyof typeof categoryColors] || categoryColors.general;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width={400}
          height={300}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleBookmarkClick}
            className={cn(
              'p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white',
              bookmarked ? 'text-primary' : 'text-gray-600',
            )}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <BookmarkIcon size={16} className={bookmarked ? 'fill-primary' : ''} />
          </button>
          <button
            onClick={handleShareClick}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white text-gray-600"
            aria-label="Share article"
          >
            <Share2Icon size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center mb-3">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${categoryColorClass}`}>
            <span className="capitalize">{article.category || 'General'}</span>
          </span>
        </div>

        {/* Title */}
        <Link href={`/news/${article.id}`}>
          <h3 className={cn('font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200', textSizeClasses[textSize])}>
            {article.title}
          </h3>
          <p className={cn('text-gray-600 leading-relaxed mb-4 line-clamp-3', textSizeClasses[textSize])}>
            {article.content}
          </p>
        </Link>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.timeAgo}</span>
            </div>
          </div>
          {article.wordCount && (
            <div className="flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>{article.wordCount} words</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;