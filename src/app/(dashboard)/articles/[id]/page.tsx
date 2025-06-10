'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaBookmark, FaShare, FaRegHeart, FaComment, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { createClient } from '@/lib/client';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  image_url: string;
  image_alt_text: string;
  category: string;
  tags: string[];
  date: string;
  read_time: string;
  author_name: string;
  author_avatar: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: string;
  tags: string[];
}

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();

  // Fetch article and related articles
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id || typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('Invalid article ID');
        }

        const response = await fetch(`/api/articles?id=${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.status}`);
        }
        const data = await response.json();
        if (!data.article) {
          throw new Error('Article not found');
        }
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.subtitle,
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-red-600 max-w-md text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p>{error || 'Article not found'}</p>
          <Link
            href="/articles"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Article Header */}
      <header className="relative bg-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

        <div className="relative max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <Link
            href="/articles"
            className="self-start mb-8 flex items-center text-sm font-medium text-blue-100 hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Articles
          </Link>

          <span className="px-3 py-1 bg-blue-500 bg-opacity-50 rounded-full text-xs font-medium uppercase tracking-wider mb-4">
            {article.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight mb-4 max-w-3xl">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
            {article.subtitle}
          </p>

          <div className="flex items-center justify-center">
            <Image
              src={article.author_avatar}
              alt={article.author_name}
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
            <div className="ml-3 text-left">
              <p className="font-medium">{article.author_name}</p>
              <p className="text-sm text-blue-100">
                {formatDate(article.date)} • {article.read_time}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative -mt-10 max-w-5xl mx-auto">
        {/* Featured Image */}
        <div className="relative h-96 mx-4">
          <Image
            src={article.image_url || '/placeholder.jpg'}
            alt={article.image_alt_text || article.title}
            fill
            className="object-cover rounded-xl shadow-xl"
            sizes="(max-width: 768px) 92vw, 896px"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8 mb-16 mx-4 p-8 md:p-12 max-w-[720px] mx-auto">
          {/* Action buttons */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-700'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                <FaRegHeart className={isLiked ? 'text-red-500' : ''} size={16} />
                <span>Like</span>
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium ${
                  isBookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-500 dark:bg-blue-900/20 dark:border-blue-700'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                <FaBookmark className={isBookmarked ? 'text-blue-500' : ''} size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={() => {}}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium"
              >
                <FaComment size={16} />
                <span>Comment</span>
              </button>
            </div>
            <div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium"
              >
                <FaShare size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div
            className="prose prose-xl dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-lg prose-li:leading-relaxed prose-li:mb-2
              prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:my-6
              prose-code:text-base prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:hover:text-blue-800 dark:prose-a:hover:text-blue-300 prose-a:font-medium
              prose-strong:font-semibold
              prose-em:font-serif
              prose-ul:mb-6 prose-ol:mb-6
              prose-img:rounded-lg prose-img:my-6 prose-img:mx-auto
              prose-table:text-base prose-table:my-6
              prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-800
              prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share section */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="p-3 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-colors">
                <FaTwitter size={20} />
              </button>
              <button className="p-3 bg-[#4267B2] text-white rounded-full hover:bg-opacity-90 transition-colors">
                <FaFacebook size={20} />
              </button>
              <button className="p-3 bg-[#0077B5] text-white rounded-full hover:bg-opacity-90 transition-colors">
                <FaLinkedin size={20} />
              </button>
            </div>
          </div>

          {/* Author bio */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-start">
              <Image
                src={article.author_avatar}
                alt={article.author_name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div className="ml-4">
                <h3 className="text-xl font-bold">{article.author_name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                  Staff Writer at Blogify. Writes about technology, design, and digital culture.
                </p>
                <div className="mt-3">
                  <Link
                    href={`/author/${article.author_name.toLowerCase().replace(' ', '-')}`}
                    className="text-blue-600 dark:text-blue-400 text-base font-medium hover:underline"
                  >
                    View all articles by this author
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mx-4 mb-16 max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-[2rem] font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={related.image_url || '/placeholder.jpg'}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/40"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium rounded-full text-sm">
                        {related.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {related.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View all articles
              </Link>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <div className="mx-4 mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white max-w-5xl mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h3 className="text-2xl font-bold mb-2">Enjoyed this article?</h3>
              <p className="text-blue-100 text-lg">Subscribe to our newsletter and never miss our latest updates, tips, and exclusive content.</p>
            </div>
            <div className="md:w-1/2">
              <form className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg sm:rounded-l-none mt-2 sm:mt-0 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-blue-100 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}