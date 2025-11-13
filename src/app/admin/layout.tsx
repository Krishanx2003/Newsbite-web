import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';

import Header from './_components/Header';
import { AdminSidebar } from './_components/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Uncomment if needed for auth checks:
  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || profile.role !== 'admin') redirect('/');

  return (

      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
            {children}
          </main>
        </div>
      </div>

  );
}