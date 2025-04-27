import Link from "next/link"
import { cn } from "@/lib/utils"

interface TagProps {
  tag: string
  className?: string
}

export function Tag({ tag, className }: TagProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className,
      )}
    >
      {tag}
    </Link>
  )
}
