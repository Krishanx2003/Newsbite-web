import React from 'react';
import { Newspaper } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="p-6 flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-2">
        <Newspaper className="h-8 w-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-white">QuickBrief</h1>
      </div>
      <p className="text-gray-400 text-center italic max-w-md">
        "News that matters. Insights that drive action."
      </p>
    </header>
  );
};

export default Header;