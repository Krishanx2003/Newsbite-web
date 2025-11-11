'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner, FaQuestionCircle, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { createClient } from '@/lib/client'; // Client-side Supabase client

interface Poll {
  id: string;
  question: string;
  category: string | null;
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
  text: string;
  votes: number;
}

interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string | null;
  ip_address: string | null;
  created_at: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
}

interface Category {
  name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'polls');
  const [darkMode, setDarkMode] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [isLoading, setIsLoading] = useState({ polls: true, options: false, votes: false, news: true, categories: true });
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState({ polls: '', options: '', votes: '', news: '' });
  const [editing, setEditing] = useState<{ type: string; id: string } | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [summary, setSummary] = useState({ totalPolls: 0, activePolls: 0, totalVotes: 0, publishedNews: 0 });

  // Initialize Supabase client
  const supabase = createClient();

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Update URL with active tab
  useEffect(() => {
    router.push(`?tab=${activeTab}`, { scroll: false });
  }, [activeTab, router]);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading({ polls: true, options: false, votes: false, news: true, categories: true });
    setError(null);

    try {
      // Fetch polls
      const pollsRes = await fetch('/api/polls');
      if (!pollsRes.ok) throw new Error(`Failed to fetch polls: ${pollsRes.status}`);
      const pollsData = await pollsRes.json();
      if (!Array.isArray(pollsData)) throw new Error('Invalid polls data');
      setPolls(pollsData);

      // Fetch categories
      const catRes = await fetch('/api/categories');
      if (!catRes.ok) throw new Error(`Failed to fetch categories: ${catRes.status}`);
      const catData = await catRes.json();
      setCategories(catData);

      // Fetch news
      const newsRes = await fetch('/api/news');
      if (!newsRes.ok) throw new Error(`Failed to fetch news: ${newsRes.status}`);
      const newsData = await newsRes.json();
      setNews(newsData);

      // Update summary
      setSummary({
        totalPolls: pollsData.length,
        activePolls: pollsData.filter((p: Poll) => p.is_active).length,
        totalVotes: pollsData.reduce((sum: number, p: Poll) => sum + p.total_votes, 0),
        publishedNews: newsData.filter((n: News) => n.is_published).length,
      });

      setIsLoading((prev) => ({ ...prev, polls: false, categories: false, news: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setIsLoading((prev) => ({ ...prev, polls: false, categories: false, news: false }));
    }
  };

  // Fetch options and votes when poll is selected
  useEffect(() => {
    if (!selectedPollId) {
      setOptions([]);
      setVotes([]);
      return;
    }

    const fetchOptions = async () => {
      setIsLoading((prev) => ({ ...prev, options: true }));
      try {
        const res = await fetch(`/api/poll_options?poll_id=${selectedPollId}`);
        if (!res.ok) throw new Error(`Failed to fetch options: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid options data');
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load options');
      } finally {
        setIsLoading((prev) => ({ ...prev, options: false }));
      }
    };

    const fetchVotes = async () => {
      setIsLoading((prev) => ({ ...prev, votes: true }));
      try {
        const res = await fetch(`/api/poll_votes?poll_id=${selectedPollId}`);
        if (!res.ok) throw new Error(`Failed to fetch votes: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid votes data');
        setVotes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load votes');
      } finally {
        setIsLoading((prev) => ({ ...prev, votes: false }));
      }
    };

    fetchOptions();
    fetchVotes();
  }, [selectedPollId]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit click
  const handleEditClick = (type: string, item: any) => {
    setEditing({ type, id: item.id });
    setEditData({
      ...item,
      expires_at: item.expires_at ? new Date(item.expires_at).toISOString().slice(0, 16) : '',
      published_at: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : '',
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditing(null);
    setEditData({});
  };

  // Handle edit submit
  const handleEditSubmit = async (e: FormEvent, type: string, id: string) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = type === 'news' ? '/api/news' : type === 'options' ? '/api/poll_options' : '/api/polls';
      const body = type === 'news' ? {
        id,
        title: editData.title,
        content: editData.content,
        category: editData.category || null,
        is_published: editData.is_published,
        published_at: editData.is_published && editData.published_at ? editData.published_at : null,
      } : type === 'options' ? {
        id,
        text: editData.text,
      } : {
        id,
        question: editData.question,
        category: editData.category || null,
        expires_at: editData.expires_at || null,
        is_active: editData.is_active,
        show_results_before_voting: editData.show_results_before_voting,
        target_audience: editData.target_audience || null,
        attached_news_id: editData.attached_news_id || null,
      };

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || `Failed to update ${type}`);
      }

      const updatedItem = await res.json();
      if (type === 'news') {
        setNews(news.map((item) => (item.id === id ? updatedItem : item)));
      } else if (type === 'options') {
        setOptions(options.map((item) => (item.id === id ? updatedItem : item)));
      } else {
        setPolls(polls.map((item) => (item.id === id ? updatedItem : item)));
      }

      setEditing(null);
      setEditData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Filter data based on search
  const filteredPolls = polls.filter((p) =>
    p.question.toLowerCase().includes(search.polls.toLowerCase())
  );
  const filteredOptions = options.filter((o) =>
    o.text.toLowerCase().includes(search.options.toLowerCase())
  );
  const filteredVotes = votes.filter((v) =>
    options.find((o) => o.id === v.option_id)?.text.toLowerCase().includes(search.votes.toLowerCase())
  );
  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(search.news.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">News Polls Dashboard</h1>
            <p className="text-sm mt-1">Manage polls, options, votes, and news articles</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Summary Card */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-md text-center">
              <p className="text-sm font-medium">Total Polls</p>
              <p className="text-2xl font-bold">{summary.totalPolls}</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md text-center">
              <p className="text-sm font-medium">Active Polls</p>
              <p className="text-2xl font-bold">{summary.activePolls}</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-md text-center">
              <p className="text-sm font-medium">Total Votes</p>
              <p className="text-2xl font-bold">{summary.totalVotes}</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-md text-center">
              <p className="text-sm font-medium">Published News</p>
              <p className="text-2xl font-bold">{summary.publishedNews}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-700 mb-6">
          {['polls', 'options', 'votes', 'news'].map((tab) => (
            <button
              key={tab}
              className={`py-3 px-6 text-sm font-medium transition-colors duration-200 ${activeTab === tab
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Polls Section */}
        {activeTab === 'polls' && (
          <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Polls</h2>
              <input
                type="text"
                placeholder="Search polls..."
                value={search.polls}
                onChange={(e) => setSearch((prev) => ({ ...prev, polls: e.target.value }))}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {isLoading.polls && (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-indigo-600" size={24} />
              </div>
            )}
            {!isLoading.polls && filteredPolls.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">No polls found.</p>
            )}
            {!isLoading.polls && filteredPolls.length > 0 && (
              <ul className="space-y-4">
                {filteredPolls.map((poll) => (
                  <li key={poll.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {editing?.type === 'polls' && editing.id === poll.id ? (
                      <form onSubmit={(e) => handleEditSubmit(e, 'polls', poll.id)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Question</label>
                          <input
                            type="text"
                            value={editData.question || ''}
                            onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Category</label>
                          <select
                            value={editData.category || ''}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">None</option>
                            {categories.map((cat) => (
                              <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Expires At</label>
                          <input
                            type="datetime-local"
                            value={editData.expires_at || ''}
                            onChange={(e) => setEditData({ ...editData, expires_at: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editData.is_active}
                            onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm">Active</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editData.show_results_before_voting}
                            onChange={(e) => setEditData({ ...editData, show_results_before_voting: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm">Show Results Before Voting</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Target Audience</label>
                          <input
                            type="text"
                            value={editData.target_audience || ''}
                            onChange={(e) => setEditData({ ...editData, target_audience: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., All users"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Attached News</label>
                          <select
                            value={editData.attached_news_id || ''}
                            onChange={(e) => setEditData({ ...editData, attached_news_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">None</option>
                            {news.map((n) => (
                              <option key={n.id} value={n.id}>{n.title}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">{poll.question}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Category: {poll.category || 'None'} | Active: {poll.is_active ? 'Yes' : 'No'} | Votes: {poll.total_votes}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Audience: {poll.target_audience || 'None'} | News: {poll.attached_news_id ? news.find(n => n.id === poll.attached_news_id)?.title || 'Unknown' : 'None'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditClick('polls', poll)}
                          className="py-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Options Section */}
        {activeTab === 'options' && (
          <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Poll Options</h2>
              <div className="flex space-x-2">
                <select
                  value={selectedPollId}
                  onChange={(e) => setSelectedPollId(e.target.value)}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a poll</option>
                  {polls.map((poll) => (
                    <option key={poll.id} value={poll.id}>{poll.question}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search options..."
                  value={search.options}
                  onChange={(e) => setSearch((prev) => ({ ...prev, options: e.target.value }))}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            {isLoading.options && (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-indigo-600" size={24} />
              </div>
            )}
            {!isLoading.options && !selectedPollId && (
              <p className="text-gray-500 dark:text-gray-400">Please select a poll.</p>
            )}
            {!isLoading.options && selectedPollId && filteredOptions.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">No options found.</p>
            )}
            {!isLoading.options && selectedPollId && filteredOptions.length > 0 && (
              <ul className="space-y-4">
                {filteredOptions.map((option) => (
                  <li key={option.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {editing?.type === 'options' && editing.id === option.id ? (
                      <form onSubmit={(e) => handleEditSubmit(e, 'options', option.id)} className="space-y-2">
                        <input
                          type="text"
                          value={editData.text || ''}
                          onChange={(e) => setEditData({ ...editData, text: e.target.value })}
                          required
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="flex-1 py-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-1 px-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">{option.text}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Votes: {option.votes}</p>
                        </div>
                        <button
                          onClick={() => handleEditClick('options', option)}
                          className="py-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Votes Section */}
        {activeTab === 'votes' && (
          <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Poll Votes</h2>
              <div className="flex space-x-2">
                <select
                  value={selectedPollId}
                  onChange={(e) => setSelectedPollId(e.target.value)}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a poll</option>
                  {polls.map((poll) => (
                    <option key={poll.id} value={poll.id}>{poll.question}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search votes..."
                  value={search.votes}
                  onChange={(e) => setSearch((prev) => ({ ...prev, votes: e.target.value }))}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            {isLoading.votes && (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-indigo-600" size={24} />
              </div>
            )}
            {!isLoading.votes && !selectedPollId && (
              <p className="text-gray-500 dark:text-gray-400">Please select a poll.</p>
            )}
            {!isLoading.votes && selectedPollId && filteredVotes.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">No votes found.</p>
            )}
            {!isLoading.votes && selectedPollId && filteredVotes.length > 0 && (
              <ul className="space-y-4">
                {filteredVotes.map((vote) => (
                  <li key={vote.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm">Option: {options.find((o) => o.id === vote.option_id)?.text || 'Unknown'}</p>
                    <p className="text-sm">Voted by: {vote.user_id ? `User ${vote.user_id.slice(0, 8)}...` : vote.ip_address || 'Anonymous'}</p>
                    <p className="text-sm">Date: {new Date(vote.created_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* News Section */}
        {activeTab === 'news' && (
          <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">News Articles</h2>
              <input
                type="text"
                placeholder="Search news..."
                value={search.news}
                onChange={(e) => setSearch((prev) => ({ ...prev, news: e.target.value }))}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {isLoading.news && (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-indigo-600" size={24} />
              </div>
            )}
            {!isLoading.news && filteredNews.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">No news found.</p>
            )}
            {!isLoading.news && filteredNews.length > 0 && (
              <ul className="space-y-4">
                {filteredNews.map((item) => (
                  <li key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {editing?.type === 'news' && editing.id === item.id ? (
                      <form onSubmit={(e) => handleEditSubmit(e, 'news', item.id)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Title</label>
                          <input
                            type="text"
                            value={editData.title || ''}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Content</label>
                          <textarea
                            value={editData.content || ''}
                            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                            required
                            rows={5}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Category</label>
                          <select
                            value={editData.category || ''}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">None</option>
                            {categories.map((cat) => (
                              <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editData.is_published}
                            onChange={(e) => setEditData({ ...editData, is_published: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm">Published</span>
                        </div>
                        {editData.is_published && (
                          <div>
                            <label className="block text-sm font-medium">Publish Date</label>
                            <input
                              type="datetime-local"
                              value={editData.published_at || ''}
                              onChange={(e) => setEditData({ ...editData, published_at: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.content.substring(0, 100)}...</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Category: {item.category || 'None'} | Published: {item.is_published ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditClick('news', item)}
                          className="py-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Refresh All Button */}
        <button
          onClick={fetchData}
          className="mt-6 w-full py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Refresh All Data
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2025 News Polls. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}