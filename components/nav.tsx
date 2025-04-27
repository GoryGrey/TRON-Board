"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function Nav() {
  const pathname = usePathname()
  const { isAuthenticated, userProfile, isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)

  // This ensures we only render the authenticated UI after the component has mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render authenticated UI until after client-side hydration
  if (!mounted) {
    return (
      <div className="hidden md:flex md:gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  console.log("Nav component - Auth state:", { isAuthenticated, userProfile, isAdmin: isAdmin() })

  return (
    <div className="hidden md:flex md:gap-2">
      {isAuthenticated ? (
        <>
          {isAdmin() && (
            <Button asChild variant="ghost">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/boards">Boards</Link>
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  )
}
