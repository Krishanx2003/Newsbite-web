"use client"
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  return (
    <header className="bg-dark-gray border-b border-neon-blue p-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search content, users... anything"
          className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
        />
      </div>

      {/* Admin Profile & Notifications */}
      <div className="flex items-center space-x-4">
        <button className="text-neon-blue hover:text-hot-pink">
          🔔
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="/admin-avatar.png"
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
          <span>Admin</span>
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