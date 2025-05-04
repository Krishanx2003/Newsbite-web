"use client"
import React, { useState } from 'react';
import { Heart, Bot as Lotus, BookmarkPlus, Share2, MessageCircle, Facebook, Twitter, Linkedin, Send, Clock, Calendar, ChevronRight, AArrowDown as Om } from 'lucide-react';

interface ArticleDetailProps {
  article: {
    title: string;
    subtitle: string;
    author: {
      name: string;
      avatar: string;
    };
    date: string;
    readTime: string;
    category: string;
    content: string;
    tags: string[];
    imageUrl: string;
  };
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [reactions, setReactions] = useState({
    likes: 42,
    enlightened: 28,
    bookmarks: 15
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add subscription logic here
    console.log('Subscribed!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-orange-600 to-orange-500 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          <Om className="w-16 h-16 mb-6 animate-pulse" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sanskrit max-w-4xl">
            {article.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl opacity-90">
            {article.subtitle}
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full border-2 border-white/20"
              />
              <div className="text-left">
                <div className="font-semibold">{article.author.name}</div>
                <div className="text-sm opacity-80">Author</div>
              </div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} aria-hidden="true" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} aria-hidden="true" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="flex-1">
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              {/* Social Share - Floating */}
              <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors" aria-label="Share on Facebook">
                  <Facebook size={20} aria-hidden="true" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors" aria-label="Share on Twitter">
                  <Twitter size={20} aria-hidden="true" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors" aria-label="Share on LinkedIn">
                  <Linkedin size={20} aria-hidden="true" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors" aria-label="Share via Email">
                  <Send size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-orange-500 first-letter:mr-3 first-letter:float-left">
                  {article.content}
                </p>

                {/* Sanskrit Quote Example */}
                <blockquote className="my-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border-l-4 border-orange-500">
                  <p className="font-sanskrit text-xl mb-2">
                    कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
                    मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
                  </p>
                  <footer className="text-sm text-gray-600 dark:text-gray-400">
                    — Bhagavad Gita, Chapter 2, Verse 47
                  </footer>
                </blockquote>

                {/* Important Takeaway */}
                <div className="my-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-2">
                    Key Takeaway
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200">
                    The essence of karma yoga lies in performing actions without attachment to their fruits, maintaining equanimity in success and failure.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t dark:border-gray-700">
                <button
                  onClick={() => setReactions(r => ({ ...r, likes: r.likes + 1 }))}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                  aria-label="Like this article"
                >
                  <Heart size={20} aria-hidden="true" />
                  <span>{reactions.likes}</span>
                </button>
                <button
                  onClick={() => setReactions(r => ({ ...r, enlightened: r.enlightened + 1 }))}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                  aria-label="Enlightened reaction"
                >
                  <Lotus size={20} aria-hidden="true" />
                  <span>{reactions.enlightened}</span>
                </button>
                <button
                  onClick={() => setReactions(r => ({ ...r, bookmarks: r.bookmarks + 1 }))}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                  aria-label="Bookmark this article"
                >
                  <BookmarkPlus size={20} aria-hidden="true" />
                  <span>{reactions.bookmarks}</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <button
                  onClick={() => setIsCommentOpen(!isCommentOpen)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                  aria-label="Toggle comments"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  <span>Show Comments (12)</span>
                </button>

                {isCommentOpen && (
                  <div className="mt-6 space-y-6">
                    <div className="flex gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Share your thoughts..."
                          className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          aria-label="Comment input"
                        ></textarea>
                        <button className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Related Articles */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-start gap-3 group"
                    aria-label={`Related article ${i}`}
                  >
                    <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${i}?auto=format&fit=crop&q=80`}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                        Understanding Vedic Philosophy
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        5 min read
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-white/90 mb-4">
                Receive weekly insights and sacred knowledge directly in your inbox.
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 mb-4"
                  aria-label="Email for newsletter"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white text-orange-600 font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Table of Contents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {['Introduction', 'Historical Context', 'Key Concepts', 'Modern Interpretation', 'Conclusion'].map((section) => (
                  <a
                    key={section}
                    href={`#${section.toLowerCase()}`}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                    aria-label={`Go to ${section}`}
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                    <span>{section}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
