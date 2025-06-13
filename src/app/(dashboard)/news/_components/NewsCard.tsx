'use client';

import Link from 'next/link';
import { BookmarkIcon, Share2Icon, Clock, User, Hash, Twitter, Facebook, Linkedin } from 'lucide-react';
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

  const handleShareClick = (e: React.MouseEvent, platform?: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/news/${article.id}`;
    const text = article.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: article.title,
            text: article.content,
            url: url,
          }).catch((err) => {
            console.error('Error sharing:', err);
          });
        } else {
          toast.info('Share functionality would open sharing options here', {
            duration: 2000,
          });
        }
    }
  };

  const bookmarked = isBookmarked(article.id);
  const imageSrc = (article.image_url || 'https://via.placeholder.com/400x300?text=News+Image').trimStart();
  const categoryColorClass = categoryColors[article.category?.toLowerCase() as keyof typeof categoryColors] || categoryColors.general;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
      {/* Image with 16:9 aspect ratio */}
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        <Image
          src={imageSrc}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width={800}
          height={450}
          priority
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
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center mb-3">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${categoryColorClass}`}>
            <span className="capitalize">{article.category || 'General'}</span>
          </span>
        </div>

        {/* Title with improved typography */}
        <Link href={`/news/${article.id}`}>
          <h3 className={cn(
            'font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200',
            textSizeClasses[textSize],
            'font-montserrat tracking-tight'
          )}>
            {article.title}
          </h3>
          <p className={cn(
            'text-gray-600 leading-relaxed mb-4 line-clamp-3',
            textSizeClasses[textSize],
            'font-inter'
          )}>
            {article.content}
          </p>
        </Link>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span className="font-medium">{article.author}</span>
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

        {/* Social Sharing Buttons */}
        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => handleShareClick(e, 'twitter')}
            className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter size={16} />
          </button>
          <button
            onClick={(e) => handleShareClick(e, 'facebook')}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook size={16} />
          </button>
          <button
            onClick={(e) => handleShareClick(e, 'linkedin')}
            className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={16} />
          </button>
          <button
            onClick={(e) => handleShareClick(e, 'whatsapp')}
            className="p-2 text-gray-600 hover:text-green-500 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;