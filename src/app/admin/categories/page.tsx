import CategoryForm from "./_components/CategoryForm";
import CategoryList from "./_components/CategoryList";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <CategoryForm />
        <CategoryList />
      </div>
    </div>
  );
}