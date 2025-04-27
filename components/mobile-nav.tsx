"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"

export default function MobileNav() {
  const pathname = usePathname()
  const { isAuthenticated, userProfile, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // This ensures we only render the authenticated UI after the component has mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">Yī Bāng</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 px-7 pt-10">
          <Link
            href="/"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              pathname === "/" && "text-foreground",
            )}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/boards"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              pathname?.startsWith("/boards") && "text-foreground",
            )}
            onClick={() => setOpen(false)}
          >
            Boards
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              pathname?.startsWith("/about") && "text-foreground",
            )}
            onClick={() => setOpen(false)}
          >
            About
          </Link>

          {mounted && isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  pathname?.startsWith("/profile") && "text-foreground",
                )}
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              {isAdmin() && (
                <Link
                  href="/admin"
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-foreground",
                    pathname?.startsWith("/admin") && "text-foreground",
                  )}
                  onClick={() => setOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              <Button
                variant="ghost"
                className="justify-start p-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  pathname?.startsWith("/login") && "text-foreground",
                )}
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  pathname?.startsWith("/signup") && "text-foreground",
                )}
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
