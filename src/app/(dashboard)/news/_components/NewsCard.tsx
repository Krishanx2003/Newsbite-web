'use client';

import Link from 'next/link';
import { BookmarkIcon, Share2Icon } from 'lucide-react';
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
  image_url: string | null; // Changed from `image` to `image_url` to match database
  timeAgo?: string; // For formatted date
}

interface NewsCardProps {
  article: News;
}

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

  // Use image_url with fallback and trim whitespace
  const imageSrc = (article.image_url || 'https://via.placeholder.com/400x300?text=News+Image').trimStart();

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          width={400}
          height={300}
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-primary/90 text-white">
            {article.category || 'General'}
          </Badge>
        </div>
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
      <CardContent className="flex-grow flex flex-col p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">{article.timeAgo}</span>
        </div>
        <Link href={`/news/${article.id}`}>
          <h3 className={cn('font-semibold mb-2 line-clamp-2', textSizeClasses[textSize])}>
            {article.title}
          </h3>
          <p className={cn('text-muted-foreground line-clamp-3 flex-grow', textSizeClasses[textSize])}>
            {article.content}
          </p>
        </Link>
      </CardContent>
    </Card>
  );
};

export default NewsCard;