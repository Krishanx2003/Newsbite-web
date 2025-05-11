"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/client";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShare2, FiBookmark, FiVolume2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";

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
  summary: string;
  tags: string[];
  image_url: string;
  bias_score: number;
  source: string;
  key_takeaways: string[];
  actionable_insights: string[];
}

interface RelatedArticle {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTakeaway, setExpandedTakeaway] = useState<number | null>(null);
  const [pollAnswer, setPollAnswer] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data: articleData, error: articleError } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (articleError) {
          toast.error("Article not found");
          console.error(articleError);
          return;
        }

        setArticle(articleData);

        // Fetch related articles
        const { data: relatedData, error: relatedError } = await supabase
          .from("articles")
          .select("id, title, image_url, category")
          .neq("id", id)
          .contains("tags", articleData.tags)
          .limit(3);

        if (relatedError) {
          toast.error("Failed to fetch related articles");
          console.error(relatedError);
          return;
        }

        setRelatedArticles(relatedData || []);
      } catch (error) {
        toast.error("Network error: Please try again later");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, supabase]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const getBiasIndicator = (score: number) => {
    if (score < -0.5) return { color: "bg-blue-500", label: "Left Leaning" };
    if (score > 0.5) return { color: "bg-red-500", label: "Right Leaning" };
    return { color: "bg-purple-500", label: "Neutral" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-2xl font-bold text-indigo-600">
          Loading your Brevvy...
        </div>
      </div>
    );
  }

  if (!article) {
    return <div className="text-center py-8">Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <ToastContainer position="bottom-center" />
      
      {/* Hero Section */}
      <div className="relative">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 md:h-64 lg:h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-32" />
      </div>

      {/* Header Section */}
      <div className="px-4 md:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs text-white ${getBiasIndicator(article.bias_score).color}`}>
                {getBiasIndicator(article.bias_score).label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {article.source} • {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleShare} className="text-gray-500 hover:text-indigo-600">
                <FiShare2 size={18} />
              </button>
              <button className="text-gray-500 hover:text-indigo-600">
                <FiBookmark size={18} />
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2 dark:text-white">
            {article.title} {article.category === 'politics' ? '🗳️' : article.category === 'tech' ? '📱' : '🌍'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">{article.subtitle}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="px-4 md:px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
        <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-indigo-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
            <h2 className="font-bold text-indigo-700 dark:text-indigo-400 text-lg">60-Second Summary</h2>
            <button className="text-indigo-600 dark:text-indigo-400 flex items-center text-sm sm:text-base">
              <FiVolume2 className="mr-1" /> Listen
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{article.summary}</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1 dark:text-gray-400">30s read</div>
        </div>
      </div>

      {/* Actionable Insights */}
      {article.actionable_insights && article.actionable_insights.length > 0 && (
        <div className="px-4 md:px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
          <h2 className="font-bold text-lg sm:text-xl mb-4 dark:text-white">What You Can Do 🛠️</h2>
          <div className="bg-green-50 dark:bg-gray-800 rounded-xl p-4 md:p-5 border border-green-100 dark:border-gray-700">
            <ul className="space-y-3">
              {article.actionable_insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-green-100 dark:bg-gray-700 text-green-800 dark:text-green-400 rounded-full p-1 mr-3 mt-1">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 md:px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Meme Reaction */}
      <div className="px-4 md:px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
          <img 
            src="https://via.placeholder.com/600x400/f5f5f5/cccccc?text=Relevant+Meme" 
            alt="Meme reaction" 
            className="w-full"
          />
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="font-medium dark:text-white text-sm sm:text-base">How we feel about this:</h3>
              <div className="flex space-x-2">
                {['😂', '🤯', '😡', '🤷'].map((emoji) => (
                  <button key={emoji} className="text-xl sm:text-2xl hover:scale-110 transition-transform">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Poll */}
      <div className="px-4 md:px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-lg sm:text-xl mb-4 dark:text-white">Quick Poll: Your Take? 📊</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">How do you feel about this issue?</p>
          
          <div className="space-y-3">
            {['😡 Outraged', '🤔 Concerned', '😐 Neutral', '👍 Supportive'].map((option) => (
              <button
                key={option}
                onClick={() => setPollAnswer(option)}
                className={`w-full text-left p-3 rounded-lg border text-sm sm:text-base ${
                  pollAnswer === option 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700' 
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {pollAnswer && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Thanks!</span> 68% of Brevvy readers feel the same as you.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Articles */}
      <div className="px-4 md:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        <h2 className="font-bold text-lg sm:text-xl mb-4 dark:text-white">More Like This</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedArticles.map((related) => (
            <Link key={related.id} href={`/articles/${related.id}`} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 h-full group-hover:shadow-md transition-shadow">
                <img
                  src={related.image_url}
                  alt={related.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {related.category}
                  </span>
                  <h3 className="font-medium mt-2 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {related.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex justify-around sm:hidden">
        {['🏠', '🔍', '📚', '👤'].map((icon, index) => (
          <button key={index} className="text-2xl p-2">
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetailPage;