// src/app/admin/news/_components/NewsList.tsx
'use client';

import { News } from '@/types/news';
import Link from 'next/link';

interface NewsListProps {
  news: News[];
}

export default function NewsList({ news }: NewsListProps) {
  return (
    <div className="space-y-4">
      {news.map((item) => (
        <div key={item.id} className="p-4 border rounded">
          <h3 className="font-bold">{item.title}</h3>
          <p className="text-sm text-gray-500">
            Category: {item.category?.name || 'None'} | Published: {item.is_published ? 'Yes' : 'No'}
          </p>
          <Link href={`/admin/news/${item.id}/edit`} className="text-blue-500">
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}