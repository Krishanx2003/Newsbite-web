'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Poll {
  id: string;
  question: string;
}

export default function PollOptionForm() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch polls
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

        setPolls(data);
        if (data.length === 0) {
          setError('No polls available. Create a poll first.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load polls';
        console.error('Fetch polls error:', errorMessage);
        setError(errorMessage);
      }
    };
    fetchPolls();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/poll_options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poll_id: selectedPollId,
          text,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Poll option creation failed:', response.status, text);
        let errorMessage = `Failed to create option: ${response.status}`;
        if (text) {
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

      const option = await response.json();
      setSuccess(`Option "${option.text}" created successfully!`);
      setSelectedPollId('');
      setText('');
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Poll Option</h2>
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
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Option Text
          </label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter option text"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm">{success}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || polls.length === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isLoading ? 'Creating...' : 'Create Option'}
        </button>
      </form>
    </div>
  );
}