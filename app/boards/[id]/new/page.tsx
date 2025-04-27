import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getBoardById } from "@/lib/db/boards"
import CreatePostForm from "@/components/create-post-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NewPostPageProps {
  params: {
    id: string
  }
}

export default async function NewPostPage({ params }: NewPostPageProps) {
  const board = await getBoardById(params.id)

  if (!board) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Post in {board.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <CreatePostForm boardId={board.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
