"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createComment } from "@/app/actions/comment-actions"
import Image from "next/image"
import ImageUpload from "@/components/image-upload"

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: (comment: any) => void
  onCancel?: () => void
  isReply?: boolean
}

export default function CommentForm({ postId, parentId, onSuccess, onCancel, isReply = false }: CommentFormProps) {
  const { user, isAuthenticated, updatePrestigeScore } = useAuth()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to leave a comment",
        variant: "destructive",
      })
      return
    }

    if (!content.trim() && !imageUrl) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment or attach an image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const comment = await createComment({
        content: content.trim(),
        post_id: postId,
        user_id: user.id,
        parent_id: parentId || null,
        image_url: imageUrl,
      })

      if (comment) {
        setContent("")
        setImageUrl(null)
        setShowImageUpload(false)

        // Update prestige score
        updatePrestigeScore("CREATE_COMMENT")

        toast({
          title: "Comment Posted",
          description: "Your comment has been posted successfully",
        })

        if (onSuccess) {
          onSuccess(comment)
        }
      } else {
        throw new Error("Failed to create comment")
      }
    } catch (error) {
      console.error("Error creating comment:", error)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent("")
    setImageUrl(null)
    setShowImageUpload(false)
    if (onCancel) {
      onCancel()
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
  }

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload)
  }

  const removeImage = () => {
    setImageUrl(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={isReply ? "Write a reply..." : "Write a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={isReply ? 2 : 4}
        className="bg-background/50 border border-border focus:border-primary resize-none"
      />

      {imageUrl && (
        <div className="relative w-full max-w-xs mt-2">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Comment image"
            width={300}
            height={200}
            className="rounded-md border border-border"
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
          <ImageUpload onImageUploaded={handleImageUploaded} folder="comments" maxWidth={500} maxHeight={300} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={toggleImageUpload}
          className="text-xs text-muted-foreground hover:text-primary"
          variant="ghost"
          size="sm"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          {showImageUpload ? "Cancel" : "Add Image"}
        </Button>

        <div className="ml-auto flex items-center gap-2">
          {isReply && (
            <Button
              type="button"
              onClick={handleCancel}
              className="text-xs"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bracket-button-primary text-xs"
            size="sm"
            disabled={isSubmitting || (!content.trim() && !imageUrl)}
          >
            {isSubmitting ? "Posting..." : isReply ? "Reply" : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}
