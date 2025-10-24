"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Settings, FileText, BarChart3, Package, ShoppingCart, UserCircle } from "lucide-react"

interface SidebarProps {
  role: "admin" | "manager" | "customer"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/reports", label: "Reports", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const managerLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/projects", label: "Projects", icon: Package },
    { href: "/dashboard/reports", label: "Reports", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const customerLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const links = role === "admin" ? adminLinks : role === "manager" ? managerLinks : customerLinks

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
