import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import Header from './_components/Header';
import Sidebar from './_components/Sidebar';
import { ThemeProvider } from '@/components/theme-provider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // If profile is missing, role is not admin, or there was an error, redirect
  if (!profile || profile?.role !== 'admin' || profileError) {
    redirect('/');
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}