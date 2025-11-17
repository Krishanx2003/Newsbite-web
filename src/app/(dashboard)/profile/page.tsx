'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/profile';
import { createClient } from '@/lib/client';
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-slate-300 text-sm tracking-wide">Loading profile</p>
        </div>
      </div>
    );
  }

  if (error && !editMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-4">
        <div className="max-w-md w-full bg-slate-800/50 border border-amber-500/30 rounded-lg p-6 backdrop-blur">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-100 font-medium mb-2">Error Loading Profile</h3>
              <p className="text-sm text-slate-300 mb-4">{error}</p>
              <button
                onClick={fetchProfile}
                className="px-4 py-2 bg-amber-500 text-slate-900 text-sm font-medium rounded hover:bg-amber-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-amber-500 text-xs font-semibold tracking-widest uppercase">Contributor Portal</p>
            <h1 className="text-4xl font-bold text-slate-100 mt-2">Newsbite Profile</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-400 hover:text-amber-500 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
        <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mt-4" />
      </div>

      <div className="max-w-2xl">
        {/* Profile Card */}
        <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-lg overflow-hidden mb-8">
          {/* Avatar Section */}
          {profile?.avatar_url && (
            <div className="h-32 bg-gradient-to-r from-amber-500/10 to-orange-500/10 flex items-center justify-center border-b border-slate-700/50">
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover ring-2 ring-amber-500/30"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {editMode ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-xs font-semibold text-amber-500 uppercase tracking-widest mb-3">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Changes</span>}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setDisplayName(profile?.display_name || '');
                      setError(null);
                    }}
                    className="px-4 py-3 border border-slate-600/50 text-slate-300 font-medium rounded-lg hover:border-slate-500 hover:bg-slate-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Info */}
                <div>
                  <h2 className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-slate-100 font-medium">{user.email}</p>
                    </div>
                    <div className="pb-4 border-b border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Display Name</p>
                      <p className="text-slate-100 font-medium">{profile?.display_name || 'Not configured'}</p>
                    </div>
                    {profile?.updated_at && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Updated</p>
                        <p className="text-slate-100 text-sm">{new Date(profile.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Setup Prompt */}
                {!profile?.display_name && (
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4">
                    <p className="text-sm text-slate-300">
                      <span className="text-amber-500 font-semibold">Complete your profile</span> — Add a display name to get started with Newsbite.
                    </p>
                  </div>
                )}

                {/* Edit Button */}
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full px-4 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Edit Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && editMode && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-slate-500">
          <p>Newsbite Contributor Portal • Manage your profile and credentials</p>
        </div>
      </div>
    </div>
  );
}
