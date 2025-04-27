"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function CreateAdForm() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateAd = async () => {
    if (!title || !url) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and URL for the ad",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)

      const supabase = createClient()

      const { data, error } = await supabase
        .from("ads")
        .insert([
          {
            title,
            url,
            is_active: true,
          },
        ])
        .select()

      if (error) {
        console.error("Error creating ad:", error)
        toast({
          title: "Failed to Create Ad",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Ad Created",
        description: "Your ad has been created successfully",
      })

      // Reset form
      setTitle("")
      setUrl("")

      // Reload the page to show the new ad
      window.location.reload()
    } catch (error) {
      console.error("Error creating ad:", error)
      toast({
        title: "Failed to Create Ad",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h2 className="text-lg font-medium">Create New Ad</h2>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="ad-title">Ad Title</Label>
          <Input id="ad-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter ad title" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ad-url">URL</Label>
          <Input id="ad-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        </div>

        <Button onClick={handleCreateAd} disabled={isCreating || !title || !url}>
          {isCreating ? "Creating..." : "Create Ad"}
        </Button>
      </div>
    </div>
  )
}
