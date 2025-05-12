export default function Header() {
  return (
    <header className="bg-dark-gray border-b border-neon-blue p-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search content, users..."
          className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
        />
      </div>

      {/* Admin Profile & Notifications */}
      <div className="flex items-center space-x-4">
        <button className="text-neon-blue hover:text-hot-pink">
          🔔
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="/admin-avatar.png"
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}