'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaMoon, FaSun, FaArrowLeft } from 'react-icons/fa';
import { createClient } from '@/lib/client';
import sanitizeHtml from 'sanitize-html';

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
  const [poll, setPoll] = useState<Poll | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [userVote, setUserVote] = useState<PollVote | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pollLoading, setPollLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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

 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <FaArrowLeft className="animate-spin" size={24} />
          <span>Loading news...</span>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-red-500">
          {error || 'News not found'}
        </div>
      </div>
    );
  }

  const sanitizedContent = sanitizeHtml(news.content, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'img'],
    allowedAttributes: { a: ['href', 'target'], img: ['src', 'alt'] },
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/news')}
              className="flex items-center text-sm font-medium hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaArrowLeft className="mr-2" /> Back to News
            </button>
            <div>
              <h1 className="text-3xl font-bold">{news.title}</h1>
              <p className="text-sm mt-1">
                {news.category || 'Uncategorized'} •{' '}
                {news.published_at
                  ? new Date(news.published_at).toLocaleDateString()
                  : new Date(news.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="relative h-96 mb-6">
            <Image
              src="/placeholder.jpg"
              alt={news.title}
              fill
              className="object-cover rounded-lg"
              sizes="100vw"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published: {news.published_at
                ? new Date(news.published_at).toLocaleDateString()
                : 'Not published'}
            </p>
            {news.category && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-/indigo-800 dark:text-indigo-200 rounded-full text-xs">
                {news.category}
              </span>
            )}
          </div>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

        </article>
        </main>
    </div>
  );
}