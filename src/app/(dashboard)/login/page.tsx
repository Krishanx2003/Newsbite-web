// src/app/login/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button onClick={signInWithGoogle} disabled={loading}>
        {loading ? 'Loading...' : 'Sign in with Google'}
      </Button>
    </div>
  );
}