
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './lib/server';

export async function middleware(request: NextRequest) {
  const supabase = await createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes (e.g., /dashboard)
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};