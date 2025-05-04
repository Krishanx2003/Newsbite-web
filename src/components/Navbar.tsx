"use client"
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-manrope font-bold">
          <span className="text-gray-900">Vibe</span>
          <span className="text-gray-700">Check</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Trending</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
          <button 
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className="p-2"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-accordion-down">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">Home</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">Categories</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">Trending</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">About</a>
            
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="search" 
                placeholder="Search..." 
                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-500 text-gray-900"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};