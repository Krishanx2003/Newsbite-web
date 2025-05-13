'use client';

import { useState, useEffect, FormEvent } from 'react';

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

export default function PollVoteForm() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

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

        const activePolls = data.filter(
          (poll: Poll) =>
            poll.is_active &&
            (!poll.expires_at || new Date(poll.expires_at) > new Date())
        );
        setPolls(activePolls);
        if (activePolls.length === 0) {
          setError('No active polls available.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load polls';
        console.error('Fetch polls error:', errorMessage);
        setError(errorMessage);
      }
    };
    fetchPolls();
  }, []);

  // Fetch options when a poll is selected
  useEffect(() => {
    if (!selectedPollId) {
      setOptions([]);
      setSelectedOptionId('');
      return;
    }

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
    fetchOptions();
  }, [selectedPollId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/poll_votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poll_id: selectedPollId,
          option_id: selectedOptionId,
          ip_address: selectedOptionId && !isLoading ? 'anonymous' : null, // Simplified for demo
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Vote submission failed:', response.status, text);
        let errorMessage = `Failed to cast vote: ${response.status}`;
        if (response.status === 405) {
          errorMessage = 'Voting is not allowed. Please check if the server supports voting for this poll.';
        } else if (text) {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
            console.error('JSON parse error on error response:', jsonError);
            errorMessage += ` (Response: ${text})`;
          }
        }
        throw new Error(errorMessage);
      }

      const vote = await response.json();
      setSuccess('Vote cast successfully!');
      setSelectedPollId('');
      setSelectedOptionId('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Submit error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cast a Vote</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="poll" className="block text-sm font-medium text-gray-700">
            Select Poll
          </label>
          <select
            id="poll"
            value={selectedPollId}
            onChange={(e) => setSelectedPollId(e.target.value)}
            required
            disabled={polls.length === 0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
          >
            <option value="">Select a poll</option>
            {polls.map((poll) => (
              <option key={poll.id} value={poll.id}>
                {poll.question}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="option" className="block text-sm font-medium text-gray-700">
            Select Option
          </label>
          <select
            id="option"
            value={selectedOptionId}
            onChange={(e) => setSelectedOptionId(e.target.value)}
            required
            disabled={!selectedPollId || options.length === 0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm">{success}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedPollId || !selectedOptionId}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isLoading ? 'Submitting...' : 'Cast Vote'}
        </button>
      </form>
    </div>
  );
}