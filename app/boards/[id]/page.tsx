import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import PostCard from "@/components/post-card"
import { createClient } from "@/lib/supabase/server"

export default async function BoardPage({ params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Fetch board data with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", params.id)
      .single()
      .abortSignal(controller.signal)

    clearTimeout(timeoutId)

    if (boardError || !board) {
      console.error("Error fetching board:", boardError)
      return notFound()
    }

    // Fetch posts for this board with timeout
    const postsController = new AbortController()
    const postsTimeoutId = setTimeout(() => postsController.abort(), 5000)

    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("board_id", params.id)
      .order("created_at", { ascending: false })
      .abortSignal(postsController.signal)

    clearTimeout(postsTimeoutId)

    if (postsError) {
      console.error("Error fetching posts:", postsError)
      // Continue with empty posts array instead of failing
    }

    return (
      <div className="space-y-6">
        <SystemBanner message={`欢迎来到 ${board.name} 版块`} />

        {/* Wrap AdSlot to prevent it from blocking rendering */}
        <div className="ad-container">
          <AdSlot type="banner" />
        </div>

        <div className="forum-card animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-medium pixel-text">
                {board.name}
                <span className="chinese-caption block">{board.chinese_name || board.name}</span>
              </h1>
              <p className="text-muted-foreground mt-1">{board.description}</p>
            </div>

            <Link href={`/boards/${board.id}/new`}>
              <Button className="pixel-button">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet in this board</p>
                <Link href={`/boards/${board.id}/new`}>
                  <Button className="pixel-button">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create the first post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Wrap AdSlot to prevent it from blocking rendering */}
        <div className="ad-container">
          <AdSlot type="banner" />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading board:", error)
    return notFound()
  }
}
