"use client";

import {
  HomeIcon,
  NewspaperIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/admin", icon: HomeIcon },
  { name: "Article", href: "/admin/article", icon: NewspaperIcon },
  { name: "News", href: "/admin/news", icon: UsersIcon },
  { name: "Category", href: "/admin/categories", icon: QuestionMarkCircleIcon },
  { name: "Poll", href: "/admin/polls", icon: CurrencyDollarIcon },
  { name: "Insight", href: "/admin/insights", icon: CurrencyDollarIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold">
          AD
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 text-xs text-center text-gray-500 dark:text-gray-400">
        © 2025 Admin
      </div>
    </aside>
  );
}
