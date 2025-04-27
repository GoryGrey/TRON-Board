"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, ThumbsUp, Eye, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { sharePostToFeed } from "@/app/actions/feed-actions"

interface PostCardProps {
  post: {
    id: string
    title: string
    content?: string
    image_url?: string | null
    created_at: string
    user_id: string
    board_id: string
    view_count: number
    like_count: number
    comment_count: number
    users?: {
      username: string
      avatar_url?: string
      prestige_score?: number
      is_admin?: boolean
    }
    boards?: {
      name: string
    }
  }
  isLoggedIn?: boolean
  postNumber?: number
  showShareButton?: boolean
}

export default function PostCard({ post, isLoggedIn = false, postNumber, showShareButton = true }: PostCardProps) {
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [isSharing, setIsSharing] = useState(false)

  // Format the date safely
  const formattedDate = post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : "some time ago"

  // Get the first letter of the username for the avatar fallback
  const avatarFallback = post.users?.username?.charAt(0).toUpperCase() || "U"

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to share posts",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      const result = await sharePostToFeed(user.id, post.id)

      toast({
        title: "Post Shared",
        description: result.message,
      })
    } catch (error) {
      console.error("Error sharing post:", error)
      toast({
        title: "Share Failed",
        description: "There was an error sharing this post",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Link href={`/posts/${post.id}`} className="block">
      <div className="forum-card hover:border-primary/50 transition-all duration-200">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.users?.avatar_url || ""} alt={post.users?.username || "User"} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">{post.users?.username || "Anonymous"}</span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
              {post.boards && (
                <Badge variant="outline" className="ml-auto">
                  {post.boards.name}
                </Badge>
              )}
            </div>

            <h3 className="font-medium mb-2 line-clamp-2">{post.title}</h3>

            {post.content && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content.replace(/<[^>]*>/g, "")}</p>
            )}

            {post.image_url && (
              <div className="mb-3 relative w-full overflow-hidden rounded-md">
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full object-contain max-h-60"
                />
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.view_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{post.like_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{post.comment_count}</span>
              </div>

              {showShareButton && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                  disabled={isSharing}
                >
                  <Share2 className="h-3 w-3" />
                  <span>{isSharing ? "Sharing..." : "Share"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
