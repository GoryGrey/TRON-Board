"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { FeedItem } from "@/lib/db/feed"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { removeFromUserFeed } from "@/lib/db/feed"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Trash2 } from "lucide-react"

interface FeedCardProps {
  feedItem: FeedItem
  onRemove?: () => void
}

export default function FeedCard({ feedItem, onRemove }: FeedCardProps) {
  const { user } = useAuth()
  const [isRemoving, setIsRemoving] = useState(false)

  const isPost = feedItem.content_type === "post"
  const content = isPost ? feedItem.post : feedItem.comment

  if (!content) return null

  const contentUser = content.user
  const createdAt = new Date(content.created_at)
  const formattedDate = formatDistanceToNow(createdAt, { addSuffix: true })

  const handleRemove = async () => {
    if (!user || user.id !== feedItem.user_id) return

    try {
      setIsRemoving(true)
      await removeFromUserFeed(feedItem.id)
      toast({
        title: "Removed from feed",
        description: "The item has been removed from your feed.",
      })
      if (onRemove) onRemove()
    } catch (error) {
      console.error("Error removing feed item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from feed.",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={contentUser?.avatar_url || "/placeholder.svg?height=32&width=32"}
                alt={contentUser?.username}
              />
              <AvatarFallback>{contentUser?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                <Link href={`/profile/${contentUser?.username}`} className="hover:underline">
                  {contentUser?.username}
                </Link>
                <span className="text-muted-foreground text-xs">
                  {" "}
                  shared a {isPost ? "post" : "comment"} {formattedDate}
                </span>
              </div>
              {isPost && (
                <div className="text-xs text-muted-foreground">
                  in{" "}
                  <Link href={`/boards/${feedItem.post?.board_id}`} className="hover:underline">
                    {feedItem.post?.board.name}
                  </Link>
                </div>
              )}
              {!isPost && (
                <div className="text-xs text-muted-foreground">
                  on{" "}
                  <Link href={`/posts/${feedItem.comment?.post_id}`} className="hover:underline">
                    {feedItem.comment?.post.title}
                  </Link>{" "}
                  in {feedItem.comment?.post.board.name}
                </div>
              )}
            </div>
          </div>

          {user && user.id === feedItem.user_id && (
            <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isRemoving} className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove from feed</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isPost && (
          <>
            <h3 className="text-lg font-semibold mb-2">
              <Link href={`/posts/${feedItem.post?.id}`} className="hover:underline">
                {feedItem.post?.title}
              </Link>
            </h3>
            <p className="line-clamp-3">{feedItem.post?.content}</p>
            {feedItem.post?.image_url && (
              <div className="mt-2">
                <img
                  src={feedItem.post.image_url || "/placeholder.svg"}
                  alt="Post image"
                  className="rounded-md max-h-48 object-cover"
                />
              </div>
            )}
          </>
        )}

        {!isPost && (
          <>
            <p className="line-clamp-4">{feedItem.comment?.content}</p>
            {feedItem.comment?.image_url && (
              <div className="mt-2">
                <img
                  src={feedItem.comment.image_url || "/placeholder.svg"}
                  alt="Comment image"
                  className="rounded-md max-h-48 object-cover"
                />
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          {isPost && (
            <>
              <div>{feedItem.post?._count?.likes || 0} likes</div>
              <div>{feedItem.post?._count?.comments || 0} comments</div>
            </>
          )}
          {!isPost && <div>{feedItem.comment?._count?.likes || 0} likes</div>}
        </div>
      </CardFooter>
    </Card>
  )
}
