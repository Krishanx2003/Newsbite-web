'use client';

import { createContext, useContext, useState } from 'react';

interface BookmarkContextType {
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
}

const BookmarkContext = createContext<BookmarkContextType>({
  isBookmarked: () => false,
  toggleBookmark: () => {},
});

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bookmarkId) => bookmarkId !== id) : [...prev, id],
    );
  };

  return (
    <BookmarkContext.Provider value={{ isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);