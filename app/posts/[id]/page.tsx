"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Flag, Share2, Heart, MessageSquare, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import CommentForm from "@/components/comment-form"
import CommentCard from "@/components/comment-card"
import PrestigeBadge from "@/components/prestige-badge"
import AsciiArt from "@/components/ascii-art"
import { cn } from "@/lib/utils"
import { getPostById } from "@/lib/db/posts"
import { getCommentsByPostId } from "@/lib/db/comments"
import { likePost, hasUserLikedPost } from "@/app/actions/post-actions"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, updatePrestigeScore, user } = useAuth()
  const { toast } = useToast()
  const [post, setPost] = useState<any>(null)
  const [postComments, setPostComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasLiked, setHasLiked] = useState(false)
  const [hasBookmarked, setHasBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      try {
        if (!params.id) return

        // Fetch post from database
        const postData = await getPostById(params.id as string)

        if (postData) {
          setPost(postData)
          setLikeCount(postData.like_count || 0)

          // Fetch comments for this post
          const commentsData = await getCommentsByPostId(postData.id)
          setPostComments(commentsData)

          // Check if user has liked this post
          if (isAuthenticated && user) {
            const liked = await hasUserLikedPost(postData.id, user.id)
            setHasLiked(liked)
          }
        } else {
          // Post not found
          toast({
            title: "Post Not Found",
            description: "The post you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching post:", error)
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id, toast, isAuthenticated, user])

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    if (!user || !post) return

    try {
      const result = await likePost(post.id, user.id)
      setLikeCount(result.likeCount)
      setHasLiked(result.liked)

      // Update prestige score
      updatePrestigeScore("POST_LIKE", result.liked ? 1 : -1)

      toast({
        title: result.liked ? "Post Liked" : "Like Removed",
        description: result.liked ? "You've liked this post" : "You've removed your like from this post",
      })
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to bookmark posts",
        variant: "destructive",
      })
      return
    }

    setHasBookmarked(!hasBookmarked)
    toast({
      title: hasBookmarked ? "Bookmark Removed" : "Post Bookmarked",
      description: hasBookmarked
        ? "This post has been removed from your bookmarks"
        : "This post has been added to your bookmarks",
    })
  }

  const handleShare = () => {
    const postUrl = window.location.href
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Post link copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        })
      })
  }

  const handleReport = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to report posts",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Post Reported",
      description: "Thank you for reporting this post. Our moderators will review it.",
    })
  }

  const handleAddComment = (newComment: any) => {
    // If the comment has a parent_id, it's a reply
    if (newComment.parent_id) {
      // Find the parent comment and add this as a reply
      setPostComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment.id === newComment.parent_id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            }
          }
          return comment
        })
      })
    } else {
      // It's a top-level comment
      setPostComments((prev) => [newComment, ...prev])
    }

    if (post) {
      setPost({
        ...post,
        comment_count: (post.comment_count || 0) + 1,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="forum-card animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4 mb-8"></div>
          <div className="h-8 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="forum-card">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.back()} className="bracket-button-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-4">
        <button onClick={() => router.back()} className="bracket-button-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
          <span className="chinese-caption">返回</span>
        </button>
      </div>

      <div className="forum-card mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/boards/${post.board_id}`}
            className="text-xs bg-primary/10 text-primary px-2 py-0.5 hover:bg-primary/20 transition-colors duration-200 pixel-text"
          >
            {post.board?.name}
            <span className="chinese-caption">{post.board?.chinese_name}</span>
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <Link href={`/profile/${post.user_id}`} className="flex items-center gap-2">
            <div className="w-8 h-8 relative overflow-hidden">
              <Image
                src={post.author?.avatar_url || "/placeholder.svg"}
                alt={post.author?.username || "User"}
                width={32}
                height={32}
                className="avatar-forum"
              />
            </div>
            <span className="text-sm text-primary hover:underline pixel-text terminal-cursor">
              @{post.author?.username || "User"}
            </span>
          </Link>
          {post.author?.prestige_score !== undefined && (
            <PrestigeBadge score={post.author.prestige_score} isAdmin={post.author.is_admin} size="sm" />
          )}
        </div>

        <div className="post-content mb-6 whitespace-pre-line">
          {post.content}

          {post.image_url && (
            <div className="mt-4 mb-2 overflow-hidden rounded-md">
              <Image
                src={post.image_url || "/placeholder.svg"}
                alt={post.title || "Post image"}
                width={800}
                height={450}
                className="w-full max-h-[500px] object-contain"
                unoptimized={post.image_url.startsWith("data:")}
              />
            </div>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="bbs-tag text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-dashed border-border">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors duration-200 pixel-text",
              hasLiked ? "text-accent glow-text" : "text-muted-foreground hover:text-primary",
            )}
          >
            <Heart className={cn("h-5 w-5", hasLiked && "fill-accent")} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={handleBookmark}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors duration-200 pixel-text",
              hasBookmarked ? "text-accent glow-text" : "text-muted-foreground hover:text-primary",
            )}
          >
            <Bookmark className={cn("h-5 w-5", hasBookmarked && "fill-accent")} />
            <span>Save</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 pixel-text"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>

          <button
            onClick={handleReport}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200 pixel-text ml-auto"
          >
            <Flag className="h-5 w-5" />
            <span>Report</span>
          </button>
        </div>
      </div>

      <div className="forum-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
            <span className="chinese-caption">评论</span>
            <span className="text-sm text-muted-foreground">({post.comment_count || postComments.length})</span>
          </h2>
        </div>

        {isAuthenticated ? (
          <CommentForm postId={post.id} onSuccess={handleAddComment} />
        ) : (
          <div className="p-4 border border-dashed border-border rounded-sm mb-6">
            <p className="text-center text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>{" "}
              to join the conversation
            </p>
          </div>
        )}

        {postComments.length > 0 ? (
          <div className="space-y-4 mt-6">
            {postComments.map((comment) => (
              <CommentCard key={comment.id} {...comment} onReplyAdded={handleAddComment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AsciiArt art="comments" className="mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}
