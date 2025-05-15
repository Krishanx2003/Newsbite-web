'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaMoon, 
  FaSun, 
  FaArrowLeft, 
  FaBookmark, 
  FaShare, 
  FaRegThumbsUp,
  FaRegComment,
  FaClock,
  FaTag
} from 'react-icons/fa';
import { createClient } from '@/lib/client';
import sanitizeHtml from 'sanitize-html';
import { motion } from 'framer-motion';

interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_published: boolean;
  author_id: string;
}

interface Poll {
  id: string;
  question: string;
  category: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  show_results_before_voting: boolean;
  target_audience: string | null;
  attached_news_id: string | null;
  total_votes: number;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
}

export default function NewsDetailPage() {
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [userVote, setUserVote] = useState<PollVote | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pollLoading, setPollLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState('3 min');
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();

  // Toggle dark mode
  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Calculate reading time
  useEffect(() => {
    if (news?.content) {
      // Average reading speed is around 200-250 words per minute
      const wordCount = news.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 225));
      setReadingTime(`${minutes} min read`);
    }
  }, [news]);

  // Fetch news item
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id || typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('Invalid news ID');
        }

        const { data, error } = await supabase
          .from('news')
          .select('id, title, content, category, created_at, updated_at, published_at, is_published, author_id')
          .eq('id', id)
          .single();

        if (error || !data) {
          throw new Error('News not found');
        }

        if (!data.is_published) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || user.id !== data.author_id) {
            throw new Error('News not published');
          }
        }

        setNews(data);
        
        // Fetch related news with the same category
        if (data.category) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('news')
            .select('id, title, content, category, created_at, updated_at, published_at, is_published, author_id')
            .eq('category', data.category)
            .neq('id', data.id)
            .eq('is_published', true)
            .limit(3);
            
          if (!relatedError && relatedData) {
            setRelatedNews(relatedData);
          }
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id, supabase]);

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would implement actual bookmark logic with your backend
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Article Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'News not found'}</p>
          <button 
            onClick={() => router.push('/news')} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to News
          </button>
        </div>
      </div>
    );
  }

  const sanitizedContent = sanitizeHtml(news.content, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'img', 'blockquote'],
    allowedAttributes: { a: ['href', 'target'], img: ['src', 'alt'] },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center py-4 px-4 sm:px-6">
            <button
              onClick={() => router.push('/news')}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Go back to news"
            >
              <FaArrowLeft className="mr-2 text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Back</span>
            </button>
            
            <h1 className="text-xl font-bold hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NewsFlash
            </h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isBookmarked ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-label="Bookmark article"
              >
                <FaBookmark />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {news.category || 'General'}
              </span>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FaClock className="mr-1" />
                <span>{readingTime}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
              {news.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div>
                Published: {formatDate(news.published_at || news.created_at)}
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <FaShare className="mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="relative w-full h-72 sm:h-96 md:h-[500px] mb-8 overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/api/placeholder/1200/800"
              alt={news.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
          
          {/* Article Content */}
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8">
            <div
              className="prose dark:prose-invert prose-blue prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>
          
          {/* Social Interactions */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-10">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FaRegThumbsUp />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FaRegComment />
                <span>Comment</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaShare />
              <span>Share</span>
            </button>
          </div>
          
          {/* Related Articles */}
          {relatedNews.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Related Stories</h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {relatedNews.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                  >
                    <Link href={`/news/${item.id}`} className="block h-full">
                      <div className="relative h-40 w-full">
                        <Image
                          src="/api/placeholder/400/240"
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {item.category || 'General'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} NewsFlash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}