"use client";
import React, { useState, useEffect } from 'react';
import { Search, Menu, User, Bell, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
                width={120}  // Increased from 80
                height={220} // Increased from 80
                className="h-20 w-auto mr-2" // Increased from h-8 and made width auto to maintain aspect ratio
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
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
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
            <Button variant="outline" size="sm" className="ml-auto">
              <User className="h-4 w-4 mr-2" />
              Sign In
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