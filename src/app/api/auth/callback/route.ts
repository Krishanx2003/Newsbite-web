import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Log the origin for debugging
  console.log('Callback origin:', origin);

  if (!code) {
    console.error('No code provided in callback');
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Wait briefly to ensure session propagation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify session exists
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Session not found after code exchange');
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Log the final redirect URL
    console.log('Redirecting to:', `${origin}${next}`);
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error('Unexpected error in callback:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}