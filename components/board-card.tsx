"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Card3D from "@/components/card-3d"
import { Tag } from "@/components/tag"
import { Globe } from "lucide-react"

export interface BoardCardProps {
  id: string
  name: string
  chinese: string
  description: string
  icon?: LucideIcon // Make icon optional
  postCount: number
  className?: string
  tags?: string[]
}

export default function BoardCard({
  id,
  name,
  chinese,
  description,
  icon,
  postCount,
  className,
  tags,
}: BoardCardProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [use3DEffects, setUse3DEffects] = useState(true)

  // Default icon if none is provided
  const IconComponent = icon || Globe

  useEffect(() => {
    try {
      setIsMounted(true)

      // Check if browser supports 3D transforms
      const supports3D =
        "transform" in document.documentElement.style ||
        "webkitTransform" in document.documentElement.style ||
        "MozTransform" in document.documentElement.style

      setUse3DEffects(supports3D)
    } catch (error) {
      console.error("Error initializing BoardCard:", error)
      setUse3DEffects(false)
    }
  }, [])

  // Create the board content component
  const BoardContent = () => (
    <div className={cn("forum-card hover:border-primary/50 transition-all duration-300", className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
          {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-lg pixel-text">
            {name}
            <span className="chinese-caption block">{chinese}</span>
          </h3>

          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-muted-foreground pixel-text">Posts</div>
          <div className="text-lg font-medium pixel-text glow-text text-primary">{postCount}</div>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  )

  // Render with or without 3D effects
  if (!isMounted || !use3DEffects) {
    return (
      <Link href={`/boards/${id}`} className="block">
        <BoardContent />
      </Link>
    )
  }

  try {
    return (
      <Link href={`/boards/${id}`} className="block">
        <Card3D intensity={5}>
          <BoardContent />
        </Card3D>
      </Link>
    )
  } catch (error) {
    console.error("Error rendering Card3D in BoardCard:", error)
    return (
      <Link href={`/boards/${id}`} className="block">
        <BoardContent />
      </Link>
    )
  }
}
