import NewsForm from "./_components/NewsForm";
import NewsList from "./_components/NewsList";


export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-8">
        <NewsForm />
        <NewsList />
      </div>
    </div>
  );
}