"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function InjectAddUserButton() {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
    isAdmin: false,
  })
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.email || !newUser.username || !newUser.password) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreatingUser(true)
      const supabase = getSupabaseClient()

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      // 2. Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: newUser.email,
        username: newUser.username,
        created_at: new Date().toISOString(),
        avatar_url: "/placeholder.svg?height=96&width=96",
        role: newUser.isAdmin ? "admin" : "user",
        is_admin: newUser.isAdmin,
      })

      if (profileError) {
        throw profileError
      }

      toast({
        title: "Success",
        description: `User ${newUser.username} created successfully`,
      })

      // Reset form and close dialog
      setNewUser({
        email: "",
        username: "",
        password: "",
        isAdmin: false,
      })
      setIsAddUserDialogOpen(false)

      // Reload the page to show the new user
      window.location.reload()
    } catch (error: any) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  useEffect(() => {
    // Function to inject the button
    const injectButton = () => {
      // Find the User Management heading
      const userManagementHeading = document.evaluate(
        "//h2[contains(text(), 'User Management')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue

      if (userManagementHeading) {
        // Create a wrapper for the button
        const buttonWrapper = document.createElement("div")
        buttonWrapper.id = "add-user-button-wrapper"
        buttonWrapper.style.display = "inline-block"
        buttonWrapper.style.marginLeft = "10px"

        // Insert the wrapper after the heading
        userManagementHeading.parentNode?.insertBefore(buttonWrapper, userManagementHeading.nextSibling)

        // Create a button element
        const button = document.createElement("button")
        button.textContent = "Add User"
        button.className =
          "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
        button.style.marginLeft = "10px"

        // Add icon to button
        const icon = document.createElement("span")
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-plus mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>`
        button.prepend(icon)

        // Add click event to button
        button.addEventListener("click", () => {
          setIsAddUserDialogOpen(true)
        })

        // Add button to wrapper
        buttonWrapper.appendChild(button)
      }
    }

    // Try to inject the button after a short delay to ensure the DOM is loaded
    setTimeout(injectButton, 500)

    // Also try on DOMContentLoaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", injectButton)
    } else {
      injectButton()
    }

    // Cleanup
    return () => {
      document.removeEventListener("DOMContentLoaded", injectButton)
      const wrapper = document.getElementById("add-user-button-wrapper")
      if (wrapper) {
        wrapper.remove()
      }
    }
  }, [])

  return (
    <>
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account. Fill in all fields below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAdmin"
                  checked={newUser.isAdmin}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, isAdmin: checked as boolean })}
                />
                <Label htmlFor="isAdmin">Make this user an admin</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isCreatingUser}>
                {isCreatingUser ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
