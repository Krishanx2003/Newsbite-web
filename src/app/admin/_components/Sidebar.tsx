'use client';

import { useState } from 'react';
import { HomeIcon, NewspaperIcon, UsersIcon, QuestionMarkCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/admin', icon: HomeIcon },
  { name: 'Article', href: '/admin/article', icon: NewspaperIcon },
  { name: 'News', href: '/admin/news', icon: UsersIcon },
  { name: 'Category', href: '/admin/categories', icon: QuestionMarkCircleIcon },
  { name: 'Poll', href: '/admin/polls', icon: CurrencyDollarIcon },
  { name: 'Insight', href: '/admin/insights', icon: CurrencyDollarIcon },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`bg-dark-gray transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 text-neon-blue hover:text-hot-pink"
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center p-2 mb-2 rounded-lg ${pathname === item.href
                ? 'bg-neon-blue text-dark-gray'
                : 'hover:bg-hot-pink hover:text-dark-gray'
              }`}
          >
            <item.icon className="w-6 h-6 mr-2" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}