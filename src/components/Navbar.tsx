'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Moon, Sun, ChevronDown, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/profile';

// Define Category type based on /api/categories
interface Category {
  id: string;
  name: string;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]); // Dynamic categories
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default categories to use if fewer than 4 categories are available
  const defaultCategories: string[] = ['Tech', 'Culture', 'Politics', 'Environment', 'Entertainment'];

  // Fetch categories from /api/categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const data: Category[] = await response.json();

        // Get first 4 categories (sorted by name from API)
        const fetchedCategories = data.map((item) => item.name).slice(0, 4);

        // Include 'top' and ensure exactly 5 categories
        const uniqueCategories = ['top', ...new Set(fetchedCategories)];
        const finalCategories: string[] = uniqueCategories.length >= 5
          ? uniqueCategories.slice(0, 5) // Take first 5
          : [...uniqueCategories, ...defaultCategories.filter(cat => !uniqueCategories.includes(cat)).slice(0, 5 - uniqueCategories.length)];

        setCategories(finalCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories(['top', ...defaultCategories.slice(0, 4)]); // Fallback to 5 categories
      }
    };

    fetchCategories();

    // Real-time subscription for categories table changes
    const channel = supabase
      .channel('categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'categories',
        },
        () => {
          fetchCategories(); // Re-fetch categories on any change
        }
      )
      .subscribe();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      }
    };

    checkAuthAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setIsDropdownOpen(false);
      } else if (event === 'SIGNED_IN') {
        checkAuthAndProfile();
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
      supabase.removeChannel(channel);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [supabase]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = (href: string) => {
    router.push(href);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled ? 'bg-off-white/90 dark:bg-near-black/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-montserrat font-bold text-blue-600">
              <Image 
                src='/brevvy.png'
                alt="Brevvy Logo"
                width={120}
                height={220}
                className="h-20 w-auto mr-2"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {categories.map((category) => (
              <Link 
                key={category}
                href={category === 'top' ? '/news' : `/news?category=${category.toLowerCase()}`}
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-inter font-medium transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-transform duration-200 hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-transform duration-200 hover:scale-105"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-transform duration-200 hover:scale-105"
              asChild
            >
              <Link href="/bookmark" aria-label="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Link>
            </Button>
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDropdown}
                className="flex items-center border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-fredoka rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105"
              >
                {isAuthenticated && profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-6 w-6 rounded-full object-cover mr-2"
                  />
                ) : (
                  <span className="h-6 w-6 rounded-full bg-gray-200 mr-2" />
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-md py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => handleLinkClick('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-blue-600/10"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-blue-600/10"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLinkClick('/login')}
                      className="block w-full text-left px-4 py-2 text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-blue-600/10"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 mr-2 transition-transform duration-200 hover:scale-105"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-transform duration-200 hover:scale-105"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] py-4' : 'max-h-0'
        } bg-off-white/95 dark:bg-near-black/95 backdrop-blur-md`}
      >
        <div className="container mx-auto px-4 space-y-2">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-transform duration-200 hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-transform duration-200 hover:scale-105"
              asChild
            >
              <Link href="/bookmark" aria-label="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Link>
            </Button>
            <div className="relative ml-auto" ref={dropdownRef}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDropdown}
                className="flex items-center border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-fredoka rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105"
              >
                {isAuthenticated && profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-6 w-6 rounded-full object-cover mr-2"
                  />
                ) : (
                  <span className="h-6 w-6 rounded-full bg-gray-200 mr-2" />
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-md py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => handleLinkClick('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-blue-600/10"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-blue-600/10"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLinkClick('/login')}
                      className="block w-full text-left px-4 py-2 text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-blue-600/10"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link 
                key={category}
                href={category === 'top' ? '/news' : `/news?category=${category.toLowerCase()}`}
                className="px-3 py-2 rounded-md text-sm font-inter font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white text-center transition-transform duration-200 hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;