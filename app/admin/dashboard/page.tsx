"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, Users, FileText, BarChart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import AsciiArt from "@/components/ascii-art"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserManagement from "@/components/admin/user-management"
import ContentModeration from "@/components/admin/content-moderation"
import StatsOverview from "@/components/admin/stats-overview"
import { AuthSetup } from "./auth-setup"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only run auth checks after component is mounted to avoid hydration issues
  useEffect(() => {
    if (!isMounted) return

    // If user is not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login")
      router.push("/login")
      return
    }

    // If user is authenticated but not an admin, redirect to home
    if (!isLoading && isAuthenticated && !isAdmin()) {
      console.log("Not admin, redirecting to home")
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router, isAdmin, isMounted])

  // Show loading state while checking authentication
  if (isLoading || !isMounted) {
    return (
      <div className="forum-card animate-pulse p-8 text-center">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    )
  }

  // If user is not an admin, show access denied
  if (!isAdmin()) {
    return (
      <div className="forum-card p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to access the admin dashboard.</p>
        <Link href="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SystemBanner message="管理员控制面板 - 仅限授权管理员" />

      <AdSlot type="banner" />

      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>

      <AsciiArt type="header" text="ADMIN DASHBOARD" />

      <div className="forum-card animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-medium pixel-text">
              Admin Dashboard
              <span className="chinese-caption block">管理员控制面板</span>
            </h1>

            <p className="text-muted-foreground mt-1">Manage users, content, and view platform statistics.</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatsOverview />
              <AuthSetup />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AdSlot type="banner" />
    </div>
  )
}
