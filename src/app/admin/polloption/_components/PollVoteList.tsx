'use client';

import { useState, useEffect } from 'react';

interface Poll {
  id: string;
  question: string;
  is_active: boolean;
  expires_at: string | null;
}

interface PollOption {
  id: string;
  text: string;
}

interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string | null;
  ip_address: string | null;
  created_at: string;
}

export default function PollVoteList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls');
        if (!response.ok) {
          const text = await response.text();
          console.error('Poll fetch failed:', response.status, text);
          throw new Error(`Failed to fetch polls: ${response.status} ${text || 'No response body'}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid JSON response from server');
        }

        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          throw new Error('Expected an array of polls');
        }

        setPolls(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load polls';
        console.error('Fetch polls error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, []);

  // Fetch votes and options when a poll is selected
  useEffect(() => {
    if (!selectedPollId) {
      setVotes([]);
      setOptions([]);
      return;
    }

    const fetchVotes = async () => {
      try {
        const response = await fetch(`/api/poll_votes?poll_id=${selectedPollId}`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Votes fetch failed:', response.status, text);
          throw new Error(`Failed to fetch votes: ${response.status} ${text || 'No response body'}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid JSON response from server');
        }

        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          throw new Error('Expected an array of votes');
        }

        setVotes(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load votes';
        console.error('Fetch votes error:', errorMessage);
        setError(errorMessage);
      }
    };

    const fetchOptions = async () => {
      try {
        const response = await fetch(`/api/poll_options?poll_id=${selectedPollId}`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Options fetch failed:', response.status, text);
          throw new Error(`Failed to fetch options: ${response.status} ${text || 'No response body'}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid JSON response from server');
        }

        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          throw new Error('Expected an array of options');
        }

        setOptions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load options';
        console.error('Fetch options error:', errorMessage);
        setError(errorMessage);
      }
    };

    fetchVotes();
    fetchOptions();
  }, [selectedPollId]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Poll Votes</h2>

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

      {!isLoading && !error && selectedPollId && votes.length === 0 && (
        <div className="text-gray-500 text-sm">No votes found for this poll.</div>
      )}

      {selectedPollId && votes.length > 0 && (
        <ul className="space-y-4">
          {votes.map((vote) => (
            <li
              key={vote.id}
              className="p-4 bg-gray-50 rounded-md text-gray-700"
            >
              <p className="text-sm">
                Option: {options.find((opt) => opt.id === vote.option_id)?.text || 'Unknown'}
              </p>
              <p className="text-sm">
                Voted by: {vote.user_id ? `User ${vote.user_id.slice(0, 8)}...` : vote.ip_address || 'Anonymous'}
              </p>
              <p className="text-sm">
                Date: {new Date(vote.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => selectedPollId && setSelectedPollId(selectedPollId)} // Trigger refetch
        disabled={!selectedPollId}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        Refresh Votes
      </button>
    </div>
  );
}