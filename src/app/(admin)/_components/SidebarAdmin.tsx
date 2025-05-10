// src/components/SidebarAdmin.tsx
"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Music,
  BookText,
  FileText,
  Newspaper,
  PenTool,
  Quote,
  Calendar,
  BookOpen,
  Library,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Music, label: 'Bhajans', path: '/admin/bhajans' },
  { icon: BookText, label: 'Stotras', path: '/admin/stotras' },
  { icon: FileText, label: 'Mantras', path: '/admin/mantras' },
  { icon: Newspaper, label: 'News', path: '/admin/news' },
  { icon: PenTool, label: 'Articles', path: '/admin/articles' },
  { icon: Quote, label: 'Thought of the Day', path: '/admin/thoughts' },
  { icon: BookOpen, label: 'Scriptures', path: '/admin/scriptures' },
  { icon: Library, label: 'Media Library', path: '/admin/media' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
];

const SidebarAdmin: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-2xl text-saffron-600">🕉️ Admin</span>
      </div>
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center px-4 py-2 text-sm rounded-lg',
                  pathname === item.path
                    ? 'bg-saffron-50 text-saffron-600'
                    : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
