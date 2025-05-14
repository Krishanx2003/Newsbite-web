'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/profile';
import { createClient } from '@/lib/client';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user-profile');

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `HTTP ${response.status}`;
        } catch {
          errorMessage = `HTTP ${response.status}: Failed to parse response`;
        }
        throw new Error(`Failed to fetch profile: ${errorMessage}`);
      }

      const data: Profile = await response.json();
      setProfile(data);
      setDisplayName(data.display_name || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchProfile();
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchProfile();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ display_name: displayName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedProfile: Profile = {
        ...profile,
        id: profile?.id || user.id,
        display_name: displayName,
        avatar_url: profile?.avatar_url || null,
        updated_at: new Date().toISOString(),
      };

      setProfile(updatedProfile);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-off-white dark:bg-near-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !editMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-off-white dark:bg-near-black">
        <div className="bg-white dark:bg-gray-800 border border-coral-500/20 text-coral-500 px-4 py-3 rounded-xl shadow-md">
          <p className="text-sm font-inter">{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-fredoka rounded-md hover:bg-blue-600/80 transition-transform duration-200 hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-off-white dark:bg-near-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl transition-opacity duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-montserrat font-bold text-gray-800 dark:text-gray-200">Your Profile</h1>
            <button
              onClick={handleSignOut}
              className="text-sm font-inter text-coral-500 hover:text-coral-500/80 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="mt-6">
            {profile?.avatar_url && (
              <div className="flex justify-center mb-6">
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
            )}

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-inter font-medium text-gray-700 dark:text-gray-200">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white font-fredoka rounded-md hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-transform duration-200 hover:scale-105"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setDisplayName(profile?.display_name || '');
                      setError(null);
                    }}
                    className="px-4 py-2 border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-fredoka rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 transition-transform duration-200 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-montserrat font-bold text-gray-800 dark:text-gray-200">Information</h2>
                  <div className="mt-2">
                    <p className="text-sm font-inter text-gray-700 dark:text-gray-300">
                      Email: {user.email}
                    </p>
                    <p className="text-sm font-inter text-gray-700 dark:text-gray-300">
                      Display Name: {profile?.display_name || 'Not set'}
                    </p>
                    {profile?.updated_at && (
                      <p className="text-sm font-inter text-gray-700 dark:text-gray-300">
                        Last updated: {new Date(profile.updated_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-fredoka rounded-md hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-transform duration-200 hover:scale-105"
                >
                  Edit Profile
                </button>

                {!profile?.display_name && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 border-l-4 border-teal-500">
                    <p className="text-sm font-inter text-gray-700 dark:text-gray-300">
                      Welcome! Please set up your profile by adding a display name.
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && editMode && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 border-l-4 border-coral-500">
                <p className="text-sm font-inter text-coral-500">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}