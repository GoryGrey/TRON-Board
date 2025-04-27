"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface PostImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  expandable?: boolean
}

export default function PostImage({
  src,
  alt,
  width = 800,
  height = 500,
  className,
  priority = false,
  expandable = true,
}: PostImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!expandable) {
    return (
      <div className={cn("overflow-hidden rounded-md", className)}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover transition-all hover:scale-105"
          priority={priority}
        />
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn("overflow-hidden rounded-md cursor-pointer", className)}>
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto object-cover transition-all hover:scale-105"
            priority={priority}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={1200}
            height={800}
            className="max-h-[80vh] w-auto object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
