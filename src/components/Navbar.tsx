"use client"

import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Menu, X, Bookmark, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import type { Profile } from "@/types/profile"


interface Category {
  id: string
  name: string
  slug: string
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()
  const supabase = createClient()

  const defaultCategories: Category[] = [
    { id: "1", name: "Tech", slug: "tech" },
    { id: "2", name: "Culture", slug: "culture" },
    { id: "3", name: "Politics", slug: "politics" },
    { id: "4", name: "Entertainment", slug: "entertainment" },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }
        const data: Category[] = await response.json()
        const topCategory = { id: "0", name: "Top", slug: "top" }
        const otherCategories = data.length >= 4 ? data.slice(0, 4) : defaultCategories.slice(0, 4)
        const finalCategories = [topCategory, ...otherCategories]
        setCategories(finalCategories)
      } catch (err) {
        console.error("Failed to fetch categories:", err)
        const topCategory = { id: "0", name: "Top", slug: "top" }
        setCategories([topCategory, ...defaultCategories.slice(0, 4)])
      }
    }

    fetchCategories()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    const checkAuthAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      if (session) {
        setUser(session.user)
        try {
          const response = await fetch("/api/profile")
          if (response.ok) {
            const data = await response.json()
            setProfile(data)
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err)
        }
      }
    }

    checkAuthAndProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      if (event === "SIGNED_OUT") {
        setProfile(null)
      } else if (event === "SIGNED_IN") {
        checkAuthAndProfile()
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    setIsMenuOpen(false)
  }

  const handleCategoryClick = (slug: string) => {
    router.push(slug === "top" ? "/news" : `/news?category=${slug}`)
    setIsMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-border/40 shadow-sm" : "bg-background border-border/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
              <Image src="/newsbitelogo.svg" alt="NewsBite" width={36} height={36} className="h-9 w-auto" />
              <Image
                src="/newsbitetext.svg"
                alt="NewsBite"
                width={110}
                height={30}
                className="h-7 w-auto hidden sm:block"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Categories */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 hover:bg-accent/50 rounded-md"
                aria-label={`Navigate to ${category.name}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md hover:bg-accent/50 text-foreground/70 hover:text-foreground transition-all"
              asChild
            >
              <Link href="/bookmark" aria-label="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Link>
            </Button>

      

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 px-3 rounded-md hover:bg-accent/50 transition-all flex items-center gap-2"
                  aria-label="User menu"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {profile?.display_name ? (
                        profile.display_name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-lg border border-border/50 bg-background shadow-lg"
              >
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="px-2 py-1.5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-foreground">{profile?.display_name}</p>
                        <p className="text-xs text-foreground/60">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push("/login")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Sign in
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
  

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 w-10 rounded-md hover:bg-accent/50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-4 pb-2 space-y-3 border-t border-border/20">
            {/* Mobile Categories */}
            <div className="px-2">
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2 px-2">Categories</p>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/30 rounded-md transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="px-2 pt-3 border-t border-border/20 space-y-1">
              <button
                onClick={() => {
                  console.log("Open search")
                  setIsMenuOpen(false)
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/30 rounded-md transition-colors"
              >
                <Search className="mr-3 h-4 w-4" />
                Search
              </button>
              <Link
                href="/bookmark"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/30 rounded-md transition-colors"
              >
                <Bookmark className="mr-3 h-4 w-4" />
                Bookmarks
              </Link>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/profile")
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/30 rounded-md transition-colors"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login")
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/30 rounded-md transition-colors"
                >
                  <User className="mr-3 h-4 w-4" />
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
