'use client';

import { useState, useEffect, FormEvent } from 'react';

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

interface Category {
  name: string;
}

interface News {
  id: string;
  title: string;
}

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editShowResultsBeforeVoting, setEditShowResultsBeforeVoting] = useState(false);
  const [editTargetAudience, setEditTargetAudience] = useState('');
  const [editAttachedNewsId, setEditAttachedNewsId] = useState('');

  const fetchPolls = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/polls', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }

      const data = await response.json();
      setPolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNewsItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    }
  };

  const handleEditClick = (poll: Poll) => {
    setEditingPollId(poll.id);
    setEditQuestion(poll.question);
    setEditCategory(poll.category || '');
    setEditExpiresAt(poll.expires_at || '');
    setEditIsActive(poll.is_active);
    setEditShowResultsBeforeVoting(poll.show_results_before_voting);
    setEditTargetAudience(poll.target_audience || '');
    setEditAttachedNewsId(poll.attached_news_id || '');
  };

  const handleCancelEdit = () => {
    setEditingPollId(null);
    setEditQuestion('');
    setEditCategory('');
    setEditExpiresAt('');
    setEditIsActive(true);
    setEditShowResultsBeforeVoting(false);
    setEditTargetAudience('');
    setEditAttachedNewsId('');
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/polls', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          question: editQuestion,
          category: editCategory || null,
          expires_at: editExpiresAt || null,
          is_active: editIsActive,
          show_results_before_voting: editShowResultsBeforeVoting,
          target_audience: editTargetAudience || null,
          attached_news_id: editAttachedNewsId || null,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update poll');
      }

      const updatedPoll = await response.json();
      setPolls(polls.map((poll) => (poll.id === id ? updatedPoll : poll)));
      setEditingPollId(null);
      setEditQuestion('');
      setEditCategory('');
      setEditExpiresAt('');
      setEditIsActive(true);
      setEditShowResultsBeforeVoting(false);
      setEditTargetAudience('');
      setEditAttachedNewsId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchPolls();
    fetchCategories();
    fetchNews();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Polls</h2>

      {isLoading && (
        <div className="text-gray-500 text-sm">Loading polls...</div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {!isLoading && !error && polls.length === 0 && (
        <div className="text-gray-500 text-sm">No polls found.</div>
      )}

      {polls.length > 0 && (
        <ul className="space-y-4">
          {polls.map((poll) => (
            <li
              key={poll.id}
              className="p-4 bg-gray-50 rounded-md text-gray-700"
            >
              {editingPollId === poll.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, poll.id)} className="space-y-4">
                  <div>
                    <label htmlFor="editQuestion" className="block text-sm font-medium text-gray-700">
                      Question
                    </label>
                    <input
                      type="text"
                      id="editQuestion"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter poll question"
                    />
                  </div>

                  <div>
                    <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">
                      Category (Optional)
                    </label>
                    <select
                      id="editCategory"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="editExpiresAt" className="block text-sm font-medium text-gray-700">
                      Expires At (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="editExpiresAt"
                      value={editExpiresAt}
                      onChange={(e) => setEditExpiresAt(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editIsActive}
                        onChange={(e) => setEditIsActive(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <span className="ml-2 text-sm text-gray-700">Is Active</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editShowResultsBeforeVoting}
                        onChange={(e) => setEditShowResultsBeforeVoting(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Results Before Voting</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="editTargetAudience" className="block text-sm font-medium text-gray-700">
                      Target Audience (Optional)
                    </label>
                    <input
                      type="text"
                      id="editTargetAudience"
                      value={editTargetAudience}
                      onChange={(e) => setEditTargetAudience(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., All users, Subscribers"
                    />
                  </div>

                  <div>
                    <label htmlFor="editAttachedNewsId" className="block text-sm font-medium text-gray-700">
                      Attached News (Optional)
                    </label>
                    <select
                      id="editAttachedNewsId"
                      value={editAttachedNewsId}
                      onChange={(e) => setEditAttachedNewsId(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a news article</option>
                      {newsItems.map((news) => (
                        <option key={news.id} value={news.id}>
                          {news.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{poll.question}</h3>
                    <button
                      onClick={() => handleEditClick(poll)}
                      className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Category: {poll.category || 'None'} | Active: {poll.is_active ? 'Yes' : 'No'} | Total Votes: {poll.total_votes}
                  </p>
                  <p className="text-sm text-gray-500">
                    Target Audience: {poll.target_audience || 'None'} | Attached News: {poll.attached_news_id ? newsItems.find(n => n.id === poll.attached_news_id)?.title || 'Unknown' : 'None'}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={fetchPolls}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Refresh List
      </button>
    </div>
  );
}