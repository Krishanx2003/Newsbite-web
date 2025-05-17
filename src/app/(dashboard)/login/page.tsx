'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const redirectTo = `${window.location.origin}/api/auth/callback`; // Correct path for callback route
      console.log('RedirectTo URL:', redirectTo); // Log for debugging
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error('Error signing in:', error.message);
        setError('Failed to sign in with Google. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error during sign-in:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <Button onClick={signInWithGoogle} disabled={loading}>
        {loading ? 'Loading...' : 'Sign in with Google'}
      </Button>
    </div>
  );
}