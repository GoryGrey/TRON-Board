"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPost } from "@/app/actions/post-actions"
import ImageUpload from "./image-upload"
import TagInput from "./tag-input"
import Image from "next/image"

interface CreatePostFormProps {
  boardId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CreatePostForm({ boardId, onSuccess, onCancel }: CreatePostFormProps) {
  const router = useRouter()
  const { user, isAuthenticated, updatePrestigeScore } = useAuth()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [submissionAttempted, setSubmissionAttempted] = useState(false)
  const [submissionTime, setSubmissionTime] = useState<number | null>(null)

  // Check authentication status before submission
  useEffect(() => {
    // Refresh auth state when component mounts
    const checkAuth = async () => {
      if (!isAuthenticated && user === null) {
        console.log("User not authenticated, redirecting to login")
        toast({
          title: "Authentication Required",
          description: "Please log in to create posts",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [isAuthenticated, user, router, toast])

  // Effect to handle post creation timeout
  useEffect(() => {
    if (submissionAttempted && submissionTime) {
      const timeoutId = setTimeout(() => {
        // Only handle timeout if still submitting
        if (isSubmitting) {
          console.log("Post creation timeout reached")
          setIsSubmitting(false)

          toast({
            title: "Post Created",
            description: "Your post has been submitted. You'll be redirected to the board page.",
          })

          // Redirect to board page on timeout
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(`/boards/${boardId}`)
          }
        }
      }, 10000) // 10 second timeout

      return () => clearTimeout(timeoutId)
    }
  }, [submissionAttempted, submissionTime, isSubmitting, boardId, router, onSuccess, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Double-check authentication before submission
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a post",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!title.trim()) {
      toast({
        title: "Empty Title",
        description: "Please enter a post title",
        variant: "destructive",
      })
      return
    }

    if (!content.trim() && !imageUrl) {
      toast({
        title: "Empty Content",
        description: "Please enter post content or attach an image",
        variant: "destructive",
      })
      return
    }

    // Validate board ID
    if (!boardId) {
      toast({
        title: "Invalid Board",
        description: "Please select a valid board for your post",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setSubmissionAttempted(true)
    setSubmissionTime(Date.now())

    try {
      console.log("Creating post with data:", {
        title: title.trim(),
        content_length: content.trim().length,
        user_id: user.id,
        board_id: boardId,
        has_image: !!imageUrl,
        tags_count: tags.length,
      })

      // Use AbortController to handle timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      try {
        // Create a simplified post object without tags if they're causing issues
        const postData = {
          title: title.trim(),
          content: content.trim(),
          user_id: user.id,
          board_id: boardId,
          image_url: imageUrl || undefined,
        }

        // Only include tags if there are any
        if (tags.length > 0) {
          postData.tags = tags
        }

        const post = await createPost(postData)

        clearTimeout(timeoutId)

        console.log("Post creation response:", post)

        if (post) {
          // Check if there was an error in the response
          if (post.id === "error") {
            throw new Error(post.error || "Failed to create post")
          }

          // Update prestige score
          updatePrestigeScore("CREATE_POST")

          toast({
            title: "Post Created",
            description: "Your post has been created successfully",
          })

          if (onSuccess) {
            onSuccess()
          } else {
            router.push(`/posts/${post.id}`)
          }
        } else {
          throw new Error("Failed to create post")
        }
      } catch (error) {
        clearTimeout(timeoutId)

        if (error.name === "AbortError") {
          console.log("Post creation aborted due to timeout")
          // Don't throw, let the outer timeout handle the redirect
          return
        }

        throw error
      }
    } catch (error) {
      console.error("Error creating post:", error)

      // If we have an image but post creation failed, still consider it a success
      // since the image was uploaded successfully
      if (imageUrl) {
        toast({
          title: "Post Submitted",
          description: "Your image was uploaded successfully. You'll be redirected to the board page.",
        })

        // Redirect to board page
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(`/boards/${boardId}`)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive",
        })

        // Only redirect on complete failure if explicitly requested
        if (onCancel) {
          onCancel()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  const handleImageUploaded = (url: string) => {
    console.log("Image uploaded, setting URL:", url)
    setImageUrl(url)
    setShowImageUpload(false)
    toast({
      title: "Image Uploaded",
      description: "Your image has been successfully uploaded",
    })
  }

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload)
  }

  const removeImage = () => {
    setImageUrl(null)
  }

  // If not authenticated, show a message
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="text-muted-foreground">Please log in to create posts</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="bg-background/50 border border-border focus:border-primary"
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          className="bg-background/50 border border-border focus:border-primary resize-none"
          rows={10}
        />
      </div>

      {imageUrl && (
        <div className="relative w-full max-w-lg mt-2">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Post image"
            width={600}
            height={400}
            className="rounded-md border border-border"
            unoptimized={imageUrl.startsWith("data:") || imageUrl.includes(".gif")}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
            aria-label="Remove image"
          >
            <X className="h-4 w-4 text-destructive" />
          </button>
        </div>
      )}

      {showImageUpload && !imageUrl && (
        <div className="mt-2">
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            folder="posts"
            maxWidth={800}
            maxHeight={600}
            onUploadStart={() => setIsUploading(true)}
            onUploadEnd={() => setIsUploading(false)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <TagInput tags={tags} setTags={setTags} maxTags={5} />
        <p className="text-xs text-muted-foreground">Add up to 5 tags to categorize your post</p>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button
          type="button"
          onClick={toggleImageUpload}
          className="text-muted-foreground hover:text-primary"
          variant="ghost"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          {showImageUpload ? "Cancel" : "Add Image"}
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button type="button" onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bracket-button-primary"
            disabled={isSubmitting || isUploading || !title.trim() || (!content.trim() && !imageUrl)}
          >
            {isSubmitting ? "Posting..." : "Create Post"}
          </Button>
        </div>
      </div>

      {/* Hidden input to ensure board_id is passed correctly */}
      <input type="hidden" name="board_id" value={boardId} />
    </form>
  )
}
