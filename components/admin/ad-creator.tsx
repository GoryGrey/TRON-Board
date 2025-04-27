"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { supabase } from "@/lib/supabase-client" // Import the singleton instance

export function AdCreator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleCreateAd = async () => {
    console.log("AdCreator: Starting ad creation process")

    console.log("Create Ad button clicked")

    if (!title || !url) {
      console.log("Validation failed: Missing title or URL")
      toast({
        title: "Missing Information",
        description: "Please provide a title and URL for the ad",
        variant: "destructive",
      })
      return
    }

    // Prevent multiple submissions
    if (isCreating) {
      console.log("Already creating ad, ignoring duplicate click")
      return
    }

    try {
      console.log("Setting isCreating to true")
      setIsCreating(true)

      let finalImageUrl = imageUrl

      // If we have a file, upload it first
      if (file) {
        console.log("Uploading file before creating ad")
        setIsUploading(true)

        // Simplify the file path to avoid nested folders
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`

        // Log before upload
        console.log(`BEFORE UPLOAD: Uploading file ${fileName} to 'public' bucket`)

        // Upload with timeout
        const uploadPromise = new Promise(async (resolve, reject) => {
          try {
            const { data, error } = await supabase.storage.from("public").upload(fileName, file, { upsert: true })

            if (error) {
              reject(error)
              return
            }

            resolve(data)
          } catch (err) {
            reject(err)
          }
        })

        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Upload timed out after 15 seconds")), 15000)
        })

        // Race the upload against the timeout
        try {
          await Promise.race([uploadPromise, timeoutPromise])
          console.log("Upload completed successfully")

          // Get the public URL
          const { data: publicUrlData } = supabase.storage.from("public").getPublicUrl(fileName)

          console.log("Public URL data:", publicUrlData)

          if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error("Failed to get public URL for uploaded image")
          }

          finalImageUrl = publicUrlData.publicUrl
          console.log("Final image URL:", finalImageUrl)
        } catch (uploadError) {
          console.error("Upload error:", uploadError)
          throw new Error(`Image upload failed: ${uploadError.message || "Unknown upload error"}`)
        } finally {
          setIsUploading(false)
        }
      }

      // Use the API endpoint to create the ad
      console.log("Calling API to create ad with data:", {
        title,
        description,
        url,
        imageUrl: finalImageUrl,
      })

      // Set up a timeout for the API call
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      console.log("AdCreator: About to call createAdAction")
      const response = await fetch("/api/ads/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          url,
          imageUrl: finalImageUrl,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const result = await response.json()
      console.log("AdCreator: createAdAction completed with result:", result)
      console.log("Ad created successfully:", result)

      toast({
        title: "Ad Created",
        description: "Your ad has been created successfully",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setUrl("")
      setImageUrl("")
      setFile(null)

      // Reload the page to show the new ad after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("Error creating ad:", error)
      toast({
        title: "Failed to Create Ad",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      console.log("Setting isCreating to false")
      setIsCreating(false)
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setIsUploading(true)
    setFile(selectedFile)

    try {
      // Create a preview
      const objectUrl = URL.createObjectURL(selectedFile)
      setImageUrl(objectUrl)

      toast({
        title: "Image Selected",
        description: "Image will be uploaded when you create the ad",
      })
    } catch (error) {
      console.error("Error handling image:", error)
      toast({
        title: "Failed to Process Image",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
      setFile(null)
    } finally {
      setIsUploading(false)
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
          <Label htmlFor="ad-description">Description (Optional)</Label>
          <Textarea
            id="ad-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter ad description"
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ad-url">URL</Label>
          <Input id="ad-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ad-image">Ad Image (Optional)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="ad-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-xs"
              disabled={isUploading || isCreating}
            />
            {isUploading && <p className="text-sm text-muted-foreground">Processing...</p>}
          </div>

          {imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-green-600 mb-2">Image ready for upload</p>
              <div className="relative h-20 w-20 overflow-hidden rounded border">
                <Image src={imageUrl || "/placeholder.svg"} alt="Ad preview" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleCreateAd} disabled={isCreating || isUploading} className="w-full">
          {isCreating ? "Creating..." : "Create Ad"}
        </Button>
      </div>
    </div>
  )
}
