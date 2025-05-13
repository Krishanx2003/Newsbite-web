'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Poll {
  id: string;
  question: string;
}

interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
}

export default function PollOptionList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [options, setOptions] = useState<PollOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls');
        if (!response.ok) throw new Error('Failed to fetch polls');
        const data = await response.json();
        setPolls(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load polls');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, []);

  // Fetch options when a poll is selected
  useEffect(() => {
    if (!selectedPollId) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      try {
        const response = await fetch(`/api/poll_options?poll_id=${selectedPollId}`);
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load options');
      }
    };
    fetchOptions();
  }, [selectedPollId]);

  const handleEditClick = (option: PollOption) => {
    setEditingOptionId(option.id);
    setEditText(option.text);
  };

  const handleCancelEdit = () => {
    setEditingOptionId(null);
    setEditText('');
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/poll_options', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          text: editText,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update option');
      }

      const updatedOption = await response.json();
      setOptions(options.map((opt) => (opt.id === id ? updatedOption : opt)));
      setEditingOptionId(null);
      setEditText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Poll Options</h2>

      <div className="mb-4">
        <label htmlFor="poll" className="block text-sm font-medium text-gray-700">
          Select Poll
        </label>
        <select
          id="poll"
          value={selectedPollId}
          onChange={(e) => setSelectedPollId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a poll</option>
          {polls.map((poll) => (
            <option key={poll.id} value={poll.id}>
              {poll.question}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="text-gray-500 text-sm">Loading polls...</div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {!isLoading && !error && selectedPollId && options.length === 0 && (
        <div className="text-gray-500 text-sm">No options found for this poll.</div>
      )}

      {selectedPollId && options.length > 0 && (
        <ul className="space-y-4">
          {options.map((option) => (
            <li
              key={option.id}
              className="p-4 bg-gray-50 rounded-md text-gray-700"
            >
              {editingOptionId === option.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, option.id)} className="space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter option text"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">{option.text}</p>
                    <p className="text-sm text-gray-500">Votes: {option.votes}</p>
                  </div>
                  <button
                    onClick={() => handleEditClick(option)}
                    className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => selectedPollId && setSelectedPollId(selectedPollId)} // Trigger refetch
        disabled={!selectedPollId}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        Refresh Options
      </button>
    </div>
  );
}