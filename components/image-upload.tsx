"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "@/app/actions/upload-actions"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  className?: string
  previewUrl?: string
  folder?: string
  maxWidth?: number
  maxHeight?: number
  showPreview?: boolean
  acceptedFileTypes?: string
  maxSizeMB?: number
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

export default function ImageUpload({
  onImageUploaded,
  className,
  previewUrl,
  folder = "uploads",
  maxWidth = 800,
  maxHeight = 600,
  showPreview = true,
  acceptedFileTypes = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
  maxSizeMB = 5,
  onUploadStart,
  onUploadEnd,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(previewUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const validateFile = (file: File) => {
    setError(null) // Reset error message

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return false
    }

    // Check file type
    const allowedTypes = acceptedFileTypes.split(",")
    if (!allowedTypes.includes(file.type)) {
      setError("File type not supported")
      return false
    }

    return true
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!validateFile(selectedFile)) {
      toast({
        title: "Invalid File",
        description: error || "Invalid file type or size.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      if (onUploadStart) onUploadStart()

      // Create a preview
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      setFile(selectedFile)

      // Log file information for debugging
      console.log("Uploading file:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        folder: folder,
      })

      // Upload the file
      const result = await uploadFile(selectedFile, folder)

      if (!result.success) {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload file. This might be due to permissions.",
          variant: "destructive",
        })
        setPreview(previewUrl || null)
        console.error("Upload failed:", result.error) // Log the error
        return
      }

      console.log("Upload successful, URL:", result.url)

      // Call the callback with the URL
      onImageUploaded(result.url)

      toast({
        title: "Upload Successful",
        description: "Your image has been uploaded",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
      setPreview(previewUrl || null)
    } finally {
      setIsUploading(false)
      if (onUploadEnd) onUploadEnd()
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUploaded("")
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
        disabled={isUploading}
      />
      <p className="text-xs text-muted-foreground mb-2">Upload a JPEG, PNG, GIF or WebP image (max {maxSizeMB}MB)</p>

      {showPreview && preview ? (
        <div className="relative mb-2 group">
          {file?.type === "image/gif" ? (
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full h-auto rounded-md border border-border"
              style={{ maxHeight: `${maxHeight}px`, maxWidth: `${maxWidth}px` }}
            />
          ) : (
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              width={maxWidth}
              height={maxHeight}
              className="max-w-full h-auto rounded-md border border-border"
              style={{ maxHeight: `${maxHeight}px` }}
              unoptimized={preview?.startsWith("blob:") || preview?.startsWith("data:")}
            />
          )}
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleButtonClick}
        className="bracket-button text-xs flex items-center gap-1"
        disabled={isUploading}
      >
        {isUploading ? (
          "Uploading..."
        ) : preview ? (
          <>
            <Upload className="h-3 w-3" />
            Change Image
          </>
        ) : (
          <>
            <ImageIcon className="h-3 w-3" />
            Upload Image
          </>
        )}
      </button>
    </div>
  )
}
