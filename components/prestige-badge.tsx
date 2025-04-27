import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getRankByScore, formatPrestigeScore } from "@/lib/reputation"

interface PrestigeBadgeProps {
  score: number
  isAdmin?: boolean
  size?: "xs" | "sm" | "md" | "lg"
}

export default function PrestigeBadge({ score, isAdmin = false, size = "md" }: PrestigeBadgeProps) {
  const rank = getRankByScore(score, isAdmin)

  // Size classes
  const sizeClasses = {
    xs: "text-xs py-0.5 px-1.5",
    sm: "text-xs py-1 px-2",
    md: "text-sm py-1 px-2",
    lg: "text-sm py-1.5 px-3",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center rounded-md ${sizeClasses[size]} ${rank.color} border border-current/20`}
          >
            <span className="font-medium">{rank.title.chinese}</span>
            <span className="mx-1">•</span>
            <span>{rank.title.english}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>威望值 Prestige Score: {formatPrestigeScore(score)}</p>
          <p>
            Rank: {rank.title.chinese} ({rank.title.english})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
