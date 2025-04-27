"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import SystemBanner from "@/components/system-banner"
import ImageUpload from "@/components/image-upload"

export default function SettingsPage() {
  const router = useRouter()
  const { user, userProfile, isAuthenticated, isLoading, refreshUserProfile } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Set initial values from user profile
    if (userProfile) {
      setUsername(userProfile.username || "")
      setBio(userProfile.bio || "")
      setAvatarUrl(userProfile.avatar_url || "")
    }
  }, [isAuthenticated, isLoading, router, userProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)

    try {
      const result = await updateUserProfile(user.id, {
        username,
        avatar_url: avatarUrl,
        bio,
      })

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        })

        // Refresh the user profile to show the updated data
        if (refreshUserProfile) {
          await refreshUserProfile()
        }

        // Force a router refresh to update any UI that depends on the profile data
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: `There was an error updating your profile: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvatarUploaded = (url: string) => {
    setAvatarUrl(url)
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="forum-card animate-pulse p-8 text-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <SystemBanner message="管理您的账户设置" />

      <h1 className="text-2xl font-bold mb-6 pixel-text">
        Account Settings
        <span className="chinese-caption">账户设置</span>
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information visible to other users</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username} />
                      <AvatarFallback>{username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <ImageUpload
                      onImageUploaded={handleAvatarUploaded}
                      previewUrl={avatarUrl}
                      folder="avatars"
                      maxWidth={200}
                      maxHeight={200}
                      showPreview={false}
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-background border border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        className="bg-background border border-border resize-none h-24"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bracket-button" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-background border border-border" />
                <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable dark mode for the interface</p>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This action is irreversible and will permanently delete all your data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="comment-notifications">Comment Replies</Label>
                    <p className="text-xs text-muted-foreground">Get notified when someone replies to your comments</p>
                  </div>
                  <Switch id="comment-notifications" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="post-notifications">Post Replies</Label>
                    <p className="text-xs text-muted-foreground">Get notified when someone comments on your posts</p>
                  </div>
                  <Switch id="post-notifications" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-notifications">System Updates</Label>
                    <p className="text-xs text-muted-foreground">Get notified about system updates and announcements</p>
                  </div>
                  <Switch id="system-notifications" checked={true} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bracket-button">Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
