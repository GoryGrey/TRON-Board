"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { user, userProfile, isAdmin } = useAuth()
  const [mounted, setMounted] = React.useState(false)

  // Only show client-side components after hydration
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isAdminUser = mounted && isAdmin()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex flex-col items-center">
          <span>Home</span>
          <span className="text-xs">首页</span>
        </div>
      </Link>
      <Link
        href="/boards"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/boards" || pathname.startsWith("/boards/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex flex-col items-center">
          <span>Boards</span>
          <span className="text-xs">版块</span>
        </div>
      </Link>
      <Link
        href="/tokens"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/tokens" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex flex-col items-center">
          <span>Token Hub</span>
          <span className="text-xs">代币中心</span>
        </div>
      </Link>
      <Link
        href="/prestige"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/prestige" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex flex-col items-center">
          <span>Prestige</span>
          <span className="text-xs">威望值</span>
        </div>
      </Link>
      <Link
        href="/leaderboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/leaderboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex flex-col items-center">
          <span>Leaderboard</span>
          <span className="text-xs">排行榜</span>
        </div>
      </Link>

      {/* Only show admin link if user is admin */}
      {mounted && isAdminUser && (
        <Link
          href="/admin/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/admin" || pathname.startsWith("/admin/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <div className="flex flex-col items-center">
            <span>Admin</span>
            <span className="text-xs">管理</span>
          </div>
        </Link>
      )}
    </nav>
  )
}
