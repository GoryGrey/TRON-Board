import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import PrestigeBadge from "@/components/prestige-badge"
import { formatPrestigeScore, generateReputationBar } from "@/lib/reputation"

export interface UserProfileHeaderProps {
  user: {
    id: string
    name: string
    avatar: string
    bio: string
    joinedAt: Date | string | null
    reputation: number
    level: number
    badges: string[]
    postCount: number
    commentCount: number
    prestigeScore?: number
    isAdmin?: boolean
  }
  className?: string
}

export default function UserProfileHeader({ user, className }: UserProfileHeaderProps) {
  // Safe date formatting function
  const formatJoinDate = () => {
    try {
      if (!user.joinedAt) {
        return "recently"
      }

      // Convert string date to Date object if needed
      const dateObj = user.joinedAt instanceof Date ? user.joinedAt : new Date(user.joinedAt)

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return "recently"
      }

      return formatDistanceToNow(dateObj, { addSuffix: true })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "recently"
    }
  }

  return (
    <div className={cn("forum-card", className)}>
      <div className="post-meta mb-2">User Profile | 用户资料</div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 relative mx-auto md:mx-0">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={96}
            height={96}
            className="avatar-forum"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-medium">{user.name}</h1>

          {user.prestigeScore !== undefined && (
            <div className="mt-1">
              <PrestigeBadge score={user.prestigeScore} isAdmin={user.isAdmin} size="lg" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 pixel-text">
              Level {user.level}
            </Badge>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30 pixel-text">
              Rep: {user.reputation}
            </Badge>
            {user.prestigeScore !== undefined && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 pixel-text">
                威望值: {formatPrestigeScore(user.prestigeScore)}
              </Badge>
            )}
            {user.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="bg-accent/10 text-accent border-accent/30 pixel-text">
                {badge}
              </Badge>
            ))}
          </div>

          {user.prestigeScore !== undefined && (
            <div className="mt-2 text-center md:text-left">
              <div className="text-sm text-muted-foreground pixel-text">Prestige Bar:</div>
              <div className="text-lg font-mono tracking-wider text-primary">
                {generateReputationBar(user.prestigeScore)}
              </div>
            </div>
          )}

          <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>

          <div className="mt-4 text-xs text-muted-foreground pixel-text">
            <span>Joined {formatJoinDate()}</span>
            <span className="mx-2">•</span>
            <span>{user.postCount} posts</span>
            <span className="mx-2">•</span>
            <span>{user.commentCount} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
