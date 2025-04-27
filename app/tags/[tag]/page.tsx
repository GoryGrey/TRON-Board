import BoardCard from "@/components/board-card"
import { boards } from "@/lib/data"
import type { LucideIcon } from "lucide-react"

interface Board {
  id: string
  name: string
  chinese: string
  description: string
  icon: LucideIcon
  postCount: number
  tags?: string[]
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)

  // Filter boards that have the selected tag
  const filteredBoards = boards.filter(
    (board) => board.tags && board.tags.some((boardTag) => boardTag.toLowerCase() === tag.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="border-b border-primary/20 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {tag}
            <span className="chinese-caption block">标签</span>
          </h1>
          <p className="text-muted-foreground mt-2">Boards tagged with "{tag}"</p>
        </div>

        {filteredBoards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                name={board.name}
                chinese={board.chinese}
                description={board.description}
                icon={board.icon}
                postCount={board.postCount}
                tags={board.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-primary/20 rounded-md bg-background/50">
            <h3 className="text-lg font-medium pixel-text">No boards found</h3>
            <p className="text-muted-foreground mt-2">No boards with the tag "{tag}" were found</p>
          </div>
        )}
      </div>
    </div>
  )
}
