"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/app/actions/upload-actions"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void
  folder?: string
  isAdImage?: boolean
}

export function ImageUploader({ onImageUploaded, folder = "public", isAdImage = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset previous state
    setError(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    // Create a local preview
    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)

    // Upload to Supabase
    try {
      setIsUploading(true)

      // Create FormData and append file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      // Set flag if this is an ad image
      if (isAdImage) {
        formData.append("isAdImage", "true")
      }

      // Upload the file
      const result = await uploadFile(formData)

      if (!result.success) {
        throw new Error(result.error || "Upload failed")
      }

      // Call the callback with the uploaded image URL
      onImageUploaded(result.url)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError(error instanceof Error ? error.message : "Failed to upload image")
      // Clean up the preview on error
      URL.revokeObjectURL(localPreviewUrl)
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Button type="button" onClick={triggerFileInput} disabled={isUploading} variant="outline" className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload Image"
        )}
      </Button>

      {previewUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
