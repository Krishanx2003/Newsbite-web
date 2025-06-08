"use client";

import { useState } from 'react';
import { Instagram, Twitter, Share2, Mail } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your backend
      console.log("Subscribing email:", email);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className=" py-16 border-t ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Added this container div */}
        {/* Newsletter Section */}
        <div className="mb-12 max-w-xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Get weekly chaos 🔥</h3>
          <p className="text-black mb-6">
            Stay updated with the latest trends, memes, and cultural moments delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1  border  rounded-md px-4 py-2 focus:outline-none focus:border-electric-purple"
              required
            />
            <button
              type="submit"
              className="btn btn-primary px-6 py-2"
            >
              Subscribe
            </button>
          </form>

          {isSubmitted && (
            <p className="text-acid-green mt-2">Thanks for subscribing!</p>
          )}
        </div>

        {/* Links and Social */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-black ">
              <li><a href="#" className="hover:text-electric-purple">Fashion</a></li>
              <li><a href="#" className="hover:text-electric-purple">Pop Culture</a></li>
              <li><a href="#" className="hover:text-electric-purple">Movies</a></li>
              <li><a href="#" className="hover:text-electric-purple">Tech</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2 text-black ">
              <li><a href="#" className="hover:text-electric-purple">Our Story</a></li>
              <li><a href="#" className="hover:text-electric-purple">Team</a></li>
              <li><a href="#" className="hover:text-electric-purple">Careers</a></li>
              <li><a href="#" className="hover:text-electric-purple">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-black ">
              <li><a href="#" className="hover:text-electric-purple">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-electric-purple">Terms of Service</a></li>
              <li><a href="#" className="hover:text-electric-purple">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full text-black  flex items-center justify-center hover:bg-electric-purple transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full text-black  flex items-center justify-center hover:bg-electric-purple transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@vibecheck.in"
                className="w-10 h-10 rounded-full text-black  flex items-center justify-center hover:bg-electric-purple transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full text-black  flex items-center justify-center hover:bg-electric-purple transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t text-black  mt-12 pt-8 text-center ">
          <p>© {new Date().getFullYear()} NewsBite. All rights reserved.</p>
        </div>
      </div> {/* Closing the container div */}
    </footer>
  );
};