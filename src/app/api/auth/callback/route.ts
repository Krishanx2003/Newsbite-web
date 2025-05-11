
import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Wait briefly to ensure session propagation
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Verify session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('Session not found after code exchange');
    } else {
      console.error('Error exchanging code:', error);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}