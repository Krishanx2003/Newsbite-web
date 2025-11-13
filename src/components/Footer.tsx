"use client"

import type React from "react"
import { useState } from "react"
import { MessageCircle, Twitter, Instagram, Youtube, RedoDot as Reddit } from "lucide-react"

export const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log("Subscribing email:", email)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail("")
    }
  }

  const socialLinks = [
    {
      icon: MessageCircle,
      href: "https://whatsapp.com/channel/0029VbAFleF84OmGwXijc91T",
      label: "WhatsApp",
      color: "hover:text-green-600",
    },
    { icon: Twitter, href: "https://x.com/newsbite_in", label: "X", color: "hover:text-blue-500" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/newsbite_in",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    { icon: Youtube, href: "https://www.youtube.com/@newsbite_in", label: "YouTube", color: "hover:text-red-600" },
    { icon: Reddit, href: "https://www.reddit.com/user/newsbite_in/", label: "Reddit", color: "hover:text-orange-600" },
  ]

  return (
    <footer className="bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <div className="mb-16 max-w-2xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center">Stay Updated</h3>
          <p className="text-gray-700 mb-8 text-center text-lg">
            Get the latest trending stories, news, and cultural moments delivered straight to your inbox every week.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {isSubmitted && <p className="text-green-600 mt-3 text-center font-medium">✓ Thanks for subscribing!</p>}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Categories</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Entertainment</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Technology</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Business</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Culture</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Company</h4>
            <ul className="space-y-3">
              <li><a href="/our-story" className="text-gray-700 hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="/team" className="text-gray-700 hover:text-blue-600 transition-colors">Team</a></li>
              <li><a href="/careers" className="text-gray-700 hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/privacy-policy" className="text-gray-700 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-gray-700 hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="text-gray-700 hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              <li><a href="/sitemap" className="text-gray-700 hover:text-blue-600 transition-colors">Sitemap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Follow Us</h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 transition-all duration-300 ${color} hover:bg-gray-200`}
                  title={label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-gray-700">
              © {new Date().getFullYear()} <span className="font-bold text-blue-600">NewsBite</span>. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 text-sm text-gray-600 justify-center md:justify-end">
            <a href="#" className="hover:text-black transition-colors">Advertise with us</a>
            <a href="#" className="hover:text-black transition-colors">Report an issue</a>
            <a href="#" className="hover:text-black transition-colors">RSS Feed</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
