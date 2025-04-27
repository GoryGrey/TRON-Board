"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function LoginHelper() {
  const { signIn, debugMode } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  if (!debugMode) return null

  const handleTestLogin = async () => {
    setIsLoading(true)
    try {
      // Initialize users array with test user if it doesn't exist
      const storedUsers = localStorage.getItem("users")
      if (!storedUsers) {
        localStorage.setItem(
          "users",
          JSON.stringify([
            {
              id: "user_test123",
              email: "test@example.com",
              username: "TestUser",
              password: "password",
            },
          ]),
        )
      }

      const success = await signIn("test@example.com", "password")

      if (success) {
        toast({
          title: "Test Login Successful",
          description: "You've been logged in with the test account",
        })
        router.push("/")
      } else {
        toast({
          title: "Test Login Failed",
          description: "Could not log in with test account",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during test login:", error)
      toast({
        title: "Test Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-md">
      <h3 className="text-sm font-medium mb-2">Debug Login Helper</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Having trouble logging in? Use this helper to log in with the test account.
      </p>
      <Button onClick={handleTestLogin} disabled={isLoading} className="w-full text-xs h-8">
        {isLoading ? "Logging in..." : "Login with Test Account"}
      </Button>
    </div>
  )
}
