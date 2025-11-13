'use client';

import React, { useEffect, useState } from 'react';
import { FaNewspaper, FaPoll, FaList, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';

interface DashboardStats {
  totalNews: number;
  totalCategories: number;
  activePolls: number;
  totalArticles: number;
}

interface RecentActivity {
  type: 'news' | 'poll' | 'category' | 'article';
  title: string;
  timestamp: string;
}

const AdminPanel = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalCategories: 0,
    activePolls: 0,
    totalArticles: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [newsRes, categoriesRes, pollsRes, articlesRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/categories'),
          fetch('/api/polls'),
          fetch('/api/articles'),
        ]);

        if (!newsRes.ok || !categoriesRes.ok || !pollsRes.ok || !articlesRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [news, categories, polls, articlesData] = await Promise.all([
          newsRes.json(),
          categoriesRes.json(),
          pollsRes.json(),
          articlesRes.json(),
        ]);

        // Update stats
        setStats({
          totalNews: news.length,
          totalCategories: categories.length,
          activePolls: polls.filter((poll: any) => poll.is_active).length,
          totalArticles: articlesData.articles?.length || 0,
        });

        // Create recent activity from all sources
        const activities: RecentActivity[] = [
          ...news.slice(0, 3).map((item: any) => ({
            type: 'news',
            title: item.title,
            timestamp: item.created_at,
          })),
          ...polls.slice(0, 3).map((item: any) => ({
            type: 'poll',
            title: item.question,
            timestamp: item.created_at,
          })),
          ...categories.slice(0, 3).map((item: any) => ({
            type: 'category',
            title: item.name,
            timestamp: item.created_at,
          })),
          ...(articlesData.articles || []).slice(0, 3).map((item: any) => ({
            type: 'article',
            title: item.title,
            timestamp: item.created_at,
          })),
        ];

        // Sort by timestamp and take the most recent 5
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities.slice(0, 5));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* News Card */}
        <Link href="/admin/news" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total News</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalNews}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaNewspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Categories Card */}
        <Link href="/admin/categories" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCategories}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FaList className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Polls Card */}
        <Link href="/admin/polls" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Polls</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activePolls}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FaPoll className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Articles Card */}
        <Link href="/admin/article" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Articles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalArticles}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <FaFileAlt className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/news" className="block">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Add News
            </button>
          </Link>
          <Link href="/admin/categories" className="block">
            <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Add Category
            </button>
          </Link>
          <Link href="/admin/polls" className="block">
            <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Create Poll
            </button>
          </Link>
          <Link href="/admin/article" className="block">
            <button className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
              Write Article
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {activity.type === 'news' && <FaNewspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                {activity.type === 'poll' && <FaPoll className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                {activity.type === 'category' && <FaList className="w-5 h-5 text-green-600 dark:text-green-400" />}
                {activity.type === 'article' && <FaFileAlt className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
          </>
  );
};

export default AdminPanel;