import NewsForm from "./_components/NewsForm"
import NewsList from "./_components/NewsList"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">News Management</h1>
            <p className="text-slate-400">Create, manage, and publish your news articles</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* News Form */}
        <div>
          <NewsForm />
        </div>

        {/* News List */}
          <div>
          <h2 className="text-2xl font-semibold text-white mb-6">All News</h2>

            <NewsList />
   
        </div>
      </div>
    </div>
  )
}
