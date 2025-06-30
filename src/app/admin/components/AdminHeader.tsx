'use client';

import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { createClient } from '@/lib/client';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function AdminHeader({ title, subtitle, darkMode, setDarkMode }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
} 