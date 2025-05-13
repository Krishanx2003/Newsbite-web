import { Category } from '@/types/category';
import Link from 'next/link';


interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="p-4 border rounded">
          <h3 className="font-bold">{category.name}</h3>
          <Link href={`/admin/categories/${category.id}/edit`} className="text-blue-500">
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}