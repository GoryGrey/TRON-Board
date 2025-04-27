"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Heart, Reply, Flag, Share2, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Card3D from "@/components/card-3d"
import { useAuth } from "@/contexts/auth-context"
import PrestigeBadge from "@/components/prestige-badge"
import { shareCommentToFeed } from "@/app/actions/feed-actions"
import CommentForm from "./comment-form"
import { likeComment, hasUserLikedComment } from "@/app/actions/comment-actions"

// Update the CommentCardProps interface to include image_url
export interface CommentCardProps {
  id: string
  content: string
  created_at: string
  user_id: string
  post_id: string
  parent_id?: string | null
  like_count?: number
  image_url?: string | null
  author?: {
    id: string
    username: string
    avatar_url?: string
    prestige_score?: number
    is_admin?: boolean
  }
  replies?: any[]
  isLoggedIn?: boolean
  commentNumber?: number
  showShareButton?: boolean
  onReplyAdded?: (reply: any) => void
}

export default function CommentCard({
  id,
  content,
  created_at,
  user_id,
  post_id,
  parent_id,
  like_count = 0,
  image_url = null,
  author,
  replies = [],
  isLoggedIn = false,
  commentNumber = Math.floor(Math.random() * 10000),
  showShareButton = true,
  onReplyAdded,
}: CommentCardProps) {
  const [likes, setLikes] = useState(like_count)
  const [hasLiked, setHasLiked] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [use3DEffects, setUse3DEffects] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [showFullImage, setShowFullImage] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated, updatePrestigeScore, user } = useAuth()

  useEffect(() => {
    try {
      setIsMounted(true)

      // Check if browser supports 3D transforms
      const supports3D =
        "transform" in document.documentElement.style ||
        "webkitTransform" in document.documentElement.style ||
        "MozTransform" in document.documentElement.style

      setUse3DEffects(supports3D)

      // Check if user has liked this comment
      const checkLikeStatus = async () => {
        if (isAuthenticated && user) {
          try {
            const liked = await hasUserLikedComment(id, user.id)
            setHasLiked(liked)
          } catch (error) {
            console.error("Error checking like status:", error)
          }
        }
      }

      checkLikeStatus()
    } catch (error) {
      console.error("Error initializing CommentCard:", error)
      setUse3DEffects(false)
    }
  }, [id, isAuthenticated, user])

  // Format the date safely
  const createdAt = created_at ? new Date(created_at) : new Date()

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to like comments",
        variant: "destructive",
      })
      return
    }

    if (!user) return

    try {
      const result = await likeComment(id, user.id)
      setLikes(result.likeCount)
      setHasLiked(result.liked)

      // Update prestige score
      updatePrestigeScore("COMMENT_LIKE", result.liked ? 1 : -1)

      toast({
        title: result.liked ? "Comment Liked" : "Like Removed",
        description: result.liked ? "You've liked this comment" : "You've removed your like from this comment",
      })
    } catch (error) {
      console.error("Error liking comment:", error)
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReply = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to reply to comments",
        variant: "destructive",
      })
      return
    }

    setIsReplying(!isReplying)
  }

  const handleReplySuccess = (newReply: any) => {
    setIsReplying(false)
    if (onReplyAdded) {
      onReplyAdded(newReply)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to share comments",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      const result = await shareCommentToFeed(user.id, id)

      toast({
        title: "Comment Shared",
        description: result.message,
      })
    } catch (error) {
      console.error("Error sharing comment:", error)
      toast({
        title: "Share Failed",
        description: "There was an error sharing this comment",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleReport = () => {
    toast({
      title: "Comment Reported",
      description: "Thank you for helping keep our community safe",
    })
  }

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  const toggleFullImage = () => {
    setShowFullImage(!showFullImage)
  }

  // Create the comment content component
  const CommentContent = () => (
    <div className="forum-card animate-fade-in">
      <div className="post-meta mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary">[#]</span>
          <span>Comment #{commentNumber}</span>
          <span>|</span>
          <span>{format(createdAt, "MMM d, yyyy 'at' h:mm a")}</span>
        </div>
        <div className="text-xs text-primary/70 pixel-text">评论于 {format(createdAt, "yyyy-MM-dd HH:mm")}</div>
      </div>

      <div className="flex gap-3">
        <Link href={`/profile/${user_id}`} className="transition-transform duration-200 hover:scale-105">
          <div className="w-8 h-8 relative overflow-hidden">
            <Image
              src={author?.avatar_url || "/placeholder.svg"}
              alt={author?.username || "User"}
              width={32}
              height={32}
              className="avatar-forum"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${user_id}`}
              className="text-xs text-primary hover:underline pixel-text terminal-cursor"
            >
              @{author?.username || "User"}
            </Link>
            {author?.prestige_score !== undefined && (
              <PrestigeBadge score={author.prestige_score} isAdmin={author.is_admin} size="sm" className="ml-2" />
            )}
          </div>

          <p className="mt-2 text-sm">{content}</p>

          {image_url && (
            <div className="mt-3">
              <div className={cn("relative", showFullImage ? "w-full" : "max-w-xs")}>
                <Image
                  src={image_url || "/placeholder.svg"}
                  alt="Comment image"
                  width={showFullImage ? 800 : 300}
                  height={showFullImage ? 600 : 200}
                  className="rounded-md border border-border cursor-pointer"
                  onClick={toggleFullImage}
                />
                <button
                  onClick={toggleFullImage}
                  className="absolute bottom-2 right-2 bg-background/80 p-1 rounded-full"
                  aria-label={showFullImage ? "Shrink image" : "Expand image"}
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 border-t border-dotted border-border pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLike}
                    className={cn(
                      "flex items-center gap-1 text-xs transition-colors duration-200 pixel-text",
                      hasLiked ? "text-accent glow-text" : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    <Heart className={cn("h-3 w-3", hasLiked && "fill-accent")} />
                    <span>{likes}</span>
                  </button>
                </TooltipTrigger>
                {!isAuthenticated && (
                  <TooltipContent>
                    <p>Please log in to like comments</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleReply}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 pixel-text"
                  >
                    <Reply className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                </TooltipTrigger>
                {!isAuthenticated && (
                  <TooltipContent>
                    <p>Please log in to reply</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {showShareButton && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 pixel-text"
                disabled={isSharing}
              >
                <Share2 className="h-3 w-3" />
                <span>{isSharing ? "Sharing..." : "Share"}</span>
              </button>
            )}

            <button
              onClick={handleReport}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors duration-200 pixel-text"
            >
              <Flag className="h-3 w-3" />
              <span>Report</span>
            </button>
          </div>

          {isReplying && (
            <CommentForm
              postId={post_id}
              parentId={id}
              onSuccess={handleReplySuccess}
              onCancel={() => setIsReplying(false)}
              isReply={true}
            />
          )}

          {replies && replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={toggleReplies}
                className="text-xs text-primary hover:underline mb-2 flex items-center gap-1"
              >
                {showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </button>

              {showReplies && (
                <div className="pl-4 border-l-2 border-border space-y-3">
                  {replies.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      {...reply}
                      commentNumber={Math.floor(Math.random() * 10000)}
                      showShareButton={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Render with or without 3D effects
  if (!isMounted || !use3DEffects) {
    return <CommentContent />
  }

  try {
    return (
      <Card3D intensity={3}>
        <CommentContent />
      </Card3D>
    )
  } catch (error) {
    console.error("Error rendering Card3D in CommentCard:", error)
    return <CommentContent />
  }
}
