"use client"

import {
  HomeIcon,
  NewspaperIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navItems = [
  { name: "Overview", href: "/admin", icon: HomeIcon },
  { name: "Article", href: "/admin/article", icon: NewspaperIcon },
  { name: "News", href: "/admin/news", icon: UsersIcon },
  { name: "Category", href: "/admin/categories", icon: QuestionMarkCircleIcon },
  { name: "Poll", href: "/admin/polls", icon: CurrencyDollarIcon },
  { name: "Insight", href: "/admin/insights", icon: CurrencyDollarIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            AD
          </div>
          <div className="flex flex-col gap-0.5 flex-1 group-data-[state=collapsed]:hidden">
            <h1 className="text-sm font-semibold">Admin Panel</h1>
            <p className="text-xs text-sidebar-foreground/70">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} className="transition-colors duration-200">
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="size-5 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="px-2 py-3 text-xs text-sidebar-foreground/60 text-center">
          <p>Admin © 2025</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
