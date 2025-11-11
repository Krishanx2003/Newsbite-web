'use client';

import React, { useEffect, useState } from 'react';
import { FaNewspaper, FaPoll, FaList, FaFileAlt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimeFrame {
  label: string;
  value: 'day' | 'week' | 'month';
}

interface InsightStats {
  news: {
    total: number;
    published: number;
    views: number;
  };
  articles: {
    total: number;
    published: number;
    views: number;
  };
  polls: {
    total: number;
    active: number;
    totalVotes: number;
  };
  categories: {
    total: number;
    mostUsed: string;
  };
}

const timeFrames: TimeFrame[] = [
  { label: 'Today', value: 'day' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
];

const AdminInsights = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(timeFrames[0]);
  const [stats, setStats] = useState<InsightStats>({
    news: { total: 0, published: 0, views: 0 },
    articles: { total: 0, published: 0, views: 0 },
    polls: { total: 0, active: 0, totalVotes: 0 },
    categories: { total: 0, mostUsed: '' },
  });
  const [trendData, setTrendData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data for the selected time frame
        const [newsRes, articlesRes, pollsRes, categoriesRes] = await Promise.all([
          fetch(`/api/news?timeframe=${selectedTimeFrame.value}`),
          fetch(`/api/articles?timeframe=${selectedTimeFrame.value}`),
          fetch(`/api/polls?timeframe=${selectedTimeFrame.value}`),
          fetch(`/api/categories?timeframe=${selectedTimeFrame.value}`),
        ]);

        if (!newsRes.ok || !articlesRes.ok || !pollsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch insights data');
        }

        const [news, articles, polls, categories] = await Promise.all([
          newsRes.json(),
          articlesRes.json(),
          pollsRes.json(),
          categoriesRes.json(),
        ]);

        // Update stats
        setStats({
          news: {
            total: news.length,
            published: news.filter((item: any) => item.is_published).length,
            views: news.reduce((sum: number, item: any) => sum + (item.views || 0), 0),
          },
          articles: {
            total: articles.articles?.length || 0,
            published: articles.articles?.filter((item: any) => item.status === 'publish').length || 0,
            views: articles.articles?.reduce((sum: number, item: any) => sum + (item.views || 0), 0) || 0,
          },
          polls: {
            total: polls.length,
            active: polls.filter((poll: any) => poll.is_active).length,
            totalVotes: polls.reduce((sum: number, poll: any) => sum + (poll.total_votes || 0), 0),
          },
          categories: {
            total: categories.length,
            mostUsed: getMostUsedCategory(categories),
          },
        });

        // Generate trend data
        const trendLabels = generateTimeLabels(selectedTimeFrame.value);
        setTrendData({
          labels: trendLabels,
          datasets: [
            {
              label: 'News',
              data: generateTrendData(news, trendLabels),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
              label: 'Articles',
              data: generateTrendData(articles.articles || [], trendLabels),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
            {
              label: 'Polls',
              data: generateTrendData(polls, trendLabels),
              borderColor: 'rgb(139, 92, 246)',
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
            },
          ],
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load insights data');
      } finally {
        setLoading(false);
      }
    };

    fetchInsightsData();
  }, [selectedTimeFrame]);

  const getMostUsedCategory = (categories: any[]): string => {
    if (!categories.length) return 'N/A';
    const categoryCounts = categories.reduce((acc: { [key: string]: number }, category: any) => {
      acc[category.name] = (acc[category.name] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0][0];
  };

  const generateTimeLabels = (timeFrame: string): string[] => {
    const now = new Date();
    const labels: string[] = [];

    switch (timeFrame) {
      case 'day':
        for (let i = 0; i < 24; i++) {
          labels.push(`${i}:00`);
        }
        break;
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        break;
      case 'month':
        for (let i = 30; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        break;
    }

    return labels;
  };

  const generateTrendData = (data: any[], labels: string[]): number[] => {
    const counts = new Array(labels.length).fill(0);

    data.forEach((item: any) => {
      const date = new Date(item.created_at);
      const index = labels.findIndex(label => {
        if (selectedTimeFrame.value === 'day') {
          return label === `${date.getHours()}:00`;
        } else if (selectedTimeFrame.value === 'week') {
          return label === date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
          return label === date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      });
      if (index !== -1) {
        counts[index]++;
      }
    });

    return counts;
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insights & Analytics</h1>
        <div className="flex space-x-2">
          {timeFrames.map((timeFrame) => (
            <button
              key={timeFrame.value}
              onClick={() => setSelectedTimeFrame(timeFrame)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${selectedTimeFrame.value === timeFrame.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
            >
              <FaCalendarAlt />
              <span>{timeFrame.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* News Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">News</h3>
            <FaNewspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: <span className="font-semibold">{stats.news.total}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Published: <span className="font-semibold">{stats.news.published}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Views: <span className="font-semibold">{stats.news.views}</span>
            </p>
          </div>
        </div>

        {/* Articles Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Articles</h3>
            <FaFileAlt className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: <span className="font-semibold">{stats.articles.total}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Published: <span className="font-semibold">{stats.articles.published}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Views: <span className="font-semibold">{stats.articles.views}</span>
            </p>
          </div>
        </div>

        {/* Polls Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Polls</h3>
            <FaPoll className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: <span className="font-semibold">{stats.polls.total}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active: <span className="font-semibold">{stats.polls.active}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Votes: <span className="font-semibold">{stats.polls.totalVotes}</span>
            </p>
          </div>
        </div>

        {/* Categories Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
            <FaList className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: <span className="font-semibold">{stats.categories.total}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Most Used: <span className="font-semibold">{stats.categories.mostUsed}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content Trends</h2>
          <FaChartLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="h-96">
          <Line
            data={trendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: `Content Creation Trends - ${selectedTimeFrame.label}`,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInsights; 