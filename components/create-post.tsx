"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import CreatePostForm from "./create-post-form"
import Link from "next/link"

interface CreatePostProps {
  boardId: string
  boardName: string
  boardChinese?: string
}

export default function CreatePost({ boardId, boardName, boardChinese }: CreatePostProps) {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<any[]>([])

  const handlePostCreated = (newPost: any) => {
    // Add the new post to the list of posts
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  if (!isAuthenticated) {
    return (
      <div className="bracket-container" id="create-post">
        <div className="bracket-header">
          <h2>Join the Discussion</h2>
          <span className="chinese-caption">加入讨论</span>
        </div>
        <div className="bracket-content">
          <p>You need to be logged in to create a post.</p>
          <Link href="/login" className="bracket-button red-splash">
            Log In
            <span className="chinese-caption">登录</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <CreatePostForm
        boardId={boardId}
        boardName={boardName}
        boardChinese={boardChinese}
        onSuccess={handlePostCreated}
      />

      {/* Display newly created posts at the top */}
      {posts.length > 0 && (
        <div className="mt-4">
          <div className="bracket-container">
            <div className="bracket-header">
              <h3 className="pixel-text">Your Recent Posts</h3>
              <span className="chinese-caption">你的最新帖子</span>
            </div>
            <div className="bracket-content">
              {posts.map((post) => (
                <div key={post.id} className="post-preview">
                  <h4>{post.title}</h4>
                  <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                  <div className="post-meta">
                    <span className="post-time">Just now</span>
                    <Link href={`/posts/${post.id}`} className="view-post">
                      View Post
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
