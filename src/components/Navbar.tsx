"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, User, Bell, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check scroll position
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      handleSignOut();
    } else {
      router.push('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const categories = [
    'Tech', 'Culture', 'Politics', 'Environment', 'Entertainment'
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
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
                href={`#${category.toLowerCase()}`}
                className="text-black hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAuthAction}
            >
              <User className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] py-4' : 'max-h-0'
        } bg-background/95 backdrop-blur-md`}
      >
        <div className="container mx-auto px-4 space-y-2">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={handleAuthAction}
            >
              <User className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link 
                key={category}
                href={`#${category.toLowerCase()}`}
                className="px-3 py-2 rounded-md text-sm font-medium bg-muted text-center hover:bg-primary hover:text-white transition-colors"
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