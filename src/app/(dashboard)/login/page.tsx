'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Hero = () => {
  return (
    <div className="hidden md:block md:w-1/2 bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90"></div>
      <img 
        src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
        alt="News and information concept" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <div className="text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">Stay informed, make better decisions</h2>
          <p className="text-lg opacity-90">
            Get curated news and insights that matter to you, all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in:', error);
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
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Hero Image Section */}
      <Hero />
      
      {/* Login Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              News that matters. Insights that drive action.
            </h1>
            <h2 className="text-xl text-gray-600 mb-6">Welcome back</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Log in to access your personalized news feed
          </p>
          
          <Button 
            onClick={signInWithGoogle} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Sign in with Google'}
          </Button>
        </div>
      </div>
    </div>
  );
}