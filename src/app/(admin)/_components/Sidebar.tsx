'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/content', label: 'Content Management' },
    { href: '/admin/users', label: 'User Management' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/monetization', label: 'Monetization' },
    { href: '/admin/comments', label: 'Comments' },
    { href: '/admin/polls', label: 'Polls' },
     { href: '/admin/articles', label: 'Article' }
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`block p-2 rounded ${
                  pathname === item.href
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}