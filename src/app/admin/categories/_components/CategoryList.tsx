'use client';

import { Category } from '@/types/category';
import Link from 'next/link';


interface CategoryListProps {
  categories: Category[] | null;
}

export default function CategoryList({ categories }: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return <div className="text-gray-500">No categories found.</div>;
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="p-4 border rounded bg-white shadow-sm">
          <h3 className="font-bold text-lg">{category.name}</h3>
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}