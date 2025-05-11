'use client';

import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, LucideGoal as LucideGoogle } from 'lucide-react';
import Background from './_components/Background';
import LoginHeader from './_components/LoginHeader';
import NewsTicker from './_components/NewsTicker';


const LoginForm: React.FC = () => {
  const supabase = createClient();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
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

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>
      
      <button 
        className="w-full bg-white text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        onClick={handleGoogleLogin}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={loading}
      >
        <LucideGoogle className="h-5 w-5" />
        <span>{loading ? 'Loading...' : 'Continue with Google'}</span>
        <ArrowRight className={`h-4 w-4 transition-all duration-300 ${isHovered ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
      </button>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          By signing in, you agree to our <a href="#" className="text-indigo-400 hover:underline">Terms</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router, supabase]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <Background />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <LoginHeader />
        
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <LoginForm />
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-2">New to QuickBrief?</p>
              <button 
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                disabled // Assuming signup isn't implemented yet
              >
                Sign up
              </button>
              <p className="mt-4 text-sm text-gray-400">
                Join 500K+ Gen Z users getting news that matters in 60 seconds ⚡
              </p>
            </div>
          </div>
        </main>
        
        <footer className="relative z-10 p-4 text-center text-gray-500 text-sm">
          <NewsTicker />
          <p className="mt-4">© 2025 QuickBrief. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}