'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, ChevronDown, Bookmark, User, LogOut, Settings, X, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/profile';
import { ThemeToggle } from './ThemeToggle';

// Define Category type based on /api/categories
interface Category {
  id: string;
  name: string;
  slug: string;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Default categories to use if fewer than 4 categories are available
  const defaultCategories: Category[] = [
    { id: '1', name: 'Tech', slug: 'tech' },
    { id: '2', name: 'Culture', slug: 'culture' },
    { id: '3', name: 'Politics', slug: 'politics' },
    { id: '4', name: 'Entertainment', slug: 'entertainment' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const data: Category[] = await response.json();

        // Add 'top' category and ensure we have exactly 5 categories
        const topCategory = { id: '0', name: 'Top', slug: 'top' };
        const otherCategories = data.length >= 4 ? data.slice(0, 4) : defaultCategories.slice(0, 4);
        const finalCategories = [topCategory, ...otherCategories];

        setCategories(finalCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // Fallback to default categories with 'top'
        const topCategory = { id: '0', name: 'Top', slug: 'top' };
        setCategories([topCategory, ...defaultCategories.slice(0, 4)]);
      }
    };

    fetchCategories();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        setUser(session.user);
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
      } else if (event === 'SIGNED_IN') {
        checkAuthAndProfile();
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(slug === 'top' ? '/news' : `/news?category=${slug}`);
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Implement your theme toggle logic here
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105">
              <Image 
                src='/newsbitelogo.svg'
                alt="NewsBite Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <Image 
                src='/newsbitetext.svg'
                alt="NewsBite"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="px-4 py-2 rounded-xl font-inter font-medium text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Navigate to ${category.name}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:scale-105 transition-all duration-200"
              onClick={() => console.log('Open search')}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Bookmarks */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link href="/bookmark" aria-label="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-xl px-3 py-2 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="User menu"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-inter font-medium">
                        {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 rounded-xl border border-border/50 bg-popover/95 backdrop-blur-md shadow-xl animate-slide-down"
              >
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="font-inter">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.display_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => router.push('/profile')}
                      className="rounded-lg cursor-pointer hover:bg-accent transition-colors duration-150"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span className="font-inter">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/settings')}
                      className="rounded-lg cursor-pointer hover:bg-accent transition-colors duration-150"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="font-inter">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="rounded-lg cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="font-inter">Sign out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem 
                    onClick={() => router.push('/login')}
                    className="rounded-lg cursor-pointer hover:bg-accent transition-colors duration-150"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-inter">Sign in</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl hover:scale-105 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 pb-6' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 pb-2 space-y-2 bg-background/95 backdrop-blur-md rounded-xl border border-border/50 shadow-lg mt-2">
            {/* Mobile Categories */}
            <div className="px-4 pb-2">
              <h3 className="font-montserrat font-semibold text-sm text-muted-foreground mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="block w-full text-left px-3 py-2 rounded-lg font-inter font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                    aria-label={`Navigate to ${category.name}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="px-4 pt-2 border-t border-border/50">
              <h3 className="font-montserrat font-semibold text-sm text-muted-foreground mb-3">Actions</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    console.log('Open search');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-lg font-inter font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                  aria-label="Search"
                >
                  <Search className="mr-3 h-5 w-5" />
                  Search
                </button>
                <Link
                  href="/bookmark"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 rounded-lg font-inter font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                  aria-label="Bookmarks"
                >
                  <Bookmark className="mr-3 h-5 w-5" />
                  Bookmarks
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-lg font-inter font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                      aria-label="Profile"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-lg font-inter font-medium transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground hover:translate-x-1"
                      aria-label="Sign out"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      router.push('/login');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-lg font-inter font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                    aria-label="Sign in"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;