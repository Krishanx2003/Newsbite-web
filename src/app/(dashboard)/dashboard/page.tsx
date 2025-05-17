
import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="p-8">
      <h1>Welcome, {user.email}</h1>
      <form action="/api/auth/signout" method="POST">
        <button type="submit" className="mt-4 rounded bg-red-500 px-4 py-2 text-white">
          Sign Out
        </button>
      </form>
    </div>
  );
}