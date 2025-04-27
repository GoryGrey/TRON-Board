"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layout, Users, Award, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { UserNav } from "@/components/user-nav"

export default function Header() {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      chineseName: "首页",
    },
    {
      name: "Boards",
      href: "/boards",
      icon: Layout,
      chineseName: "版块",
    },
    {
      name: "Token Hub",
      href: "/tokens",
      icon: Users,
      chineseName: "团队中心",
    },
    {
      name: "Prestige",
      href: "/prestige",
      icon: Award,
      chineseName: "声望值",
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: BarChart2,
      chineseName: "排行榜",
    },
  ]

  return (
    <header className="w-full">
      {/* Main navigation */}
      <div style={{ backgroundColor: "#0d1117", borderBottom: "1px solid #1c1f26" }}>
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span style={{ color: "#ff0000" }} className="font-bold text-xl mr-1">
                TRON
              </span>
              <span className="text-white font-bold text-xl">Board</span>
            </Link>
            <span className="text-gray-400 text-xs ml-1">论坛系统</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center text-sm ${
                    isActive ? "text-white" : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span>{item.name}</span>
                  <span className="text-xs">{item.chineseName}</span>
                </Link>
              )
            })}
          </nav>

          {/* Auth buttons or user nav */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-800 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notification banner - KEEPING ONLY THIS ONE */}
      <div
        style={{
          backgroundColor: "#161b22",
          padding: "0.5rem 1rem",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#94a3b8",
          borderBottom: "1px solid #1c1f26",
        }}
      >
        <span className="mr-2">🔔</span>
        <span>欢迎来到 | TRON Board - 探索TRON生态系统和区块链的讨论平台。</span>
      </div>
    </header>
  )
}
