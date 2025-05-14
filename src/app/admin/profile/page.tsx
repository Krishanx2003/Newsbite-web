'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { createClient } from '@/lib/client';

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  role: string;
}

export default function AdminProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const supabase = createClient();

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fetch profiles
  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Admin access required');
        } else {
          throw new Error(`Failed to fetch profiles: ${response.status}`);
        }
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid profiles data');
      }

      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Filter profiles based on search
  const filteredProfiles = profiles.filter((profile) =>
    profile.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Profiles</h1>
            <p className="text-sm mt-1">Manage user profiles</p>
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
        {/* Search and Refresh */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search profiles by display name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={fetchProfiles}
            className="mt-4 sm:mt-0 sm:ml-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Refresh Profiles
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Profiles List */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Profiles</h2>
          {isLoading && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-indigo-600" size={24} />
            </div>
          )}
          {!isLoading && filteredProfiles.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No profiles found.</p>
          )}
          {!isLoading && filteredProfiles.length > 0 && (
            <ul className="space-y-4">
              {filteredProfiles.map((profile) => (
                <li key={profile.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center">
                  {profile.avatar_url && (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name || 'User'}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                      onError={(e) => (e.currentTarget.src = '/default-avatar.png')} // Fallback image
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Display Name: {profile.display_name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Role: {profile.role}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Never'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {profile.id.slice(0, 8)}...
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 News Polls. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}