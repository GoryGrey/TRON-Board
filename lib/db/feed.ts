import { createClient } from "@/lib/supabase/client"

export type FeedItem = {
  id: string
  user_id: string
  content_id: string
  content_type: "post" | "comment"
  created_at: string
  post?: {
    id: string
    title: string
    content: string
    created_at: string
    user_id: string
    board_id: string
    image_url?: string
    user: {
      username: string
      avatar_url?: string
    }
    board: {
      name: string
    }
    _count?: {
      comments: number
      likes: number
    }
  }
  comment?: {
    id: string
    content: string
    created_at: string
    user_id: string
    post_id: string
    parent_id?: string
    image_url?: string
    user: {
      username: string
      avatar_url?: string
    }
    post: {
      title: string
      board: {
        name: string
      }
    }
    _count?: {
      likes: number
    }
  }
}

export async function getUserFeed(userId: string, page = 1, pageSize = 10) {
  const supabase = createClient()
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  try {
    // First get the feed items
    const {
      data: feedItems,
      error,
      count,
    } = await supabase
      .from("user_feed")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(start, end)

    if (error) throw error

    // If no feed items, return empty array
    if (!feedItems || feedItems.length === 0) {
      return { data: [], hasMore: false }
    }

    // Process each feed item to get the associated content
    const processedItems = await Promise.all(
      feedItems.map(async (item) => {
        if (item.content_type === "post") {
          // Get post details
          const { data: post, error: postError } = await supabase
            .from("posts")
            .select(`
              id, title, content, created_at, user_id, board_id, image_url,
              user:users(username, avatar_url),
              board:boards(name)
            `)
            .eq("id", item.content_id)
            .single()

          if (postError || !post) {
            console.error("Error fetching post for feed item:", postError)
            return null
          }

          // Get post counts
          const { count: commentCount } = await supabase
            .from("comments")
            .select("id", { count: "exact" })
            .eq("post_id", post.id)

          const { count: likeCount } = await supabase
            .from("post_likes")
            .select("id", { count: "exact" })
            .eq("post_id", post.id)

          return {
            ...item,
            post: {
              ...post,
              _count: {
                comments: commentCount || 0,
                likes: likeCount || 0,
              },
            },
          }
        } else if (item.content_type === "comment") {
          // Get comment details
          const { data: comment, error: commentError } = await supabase
            .from("comments")
            .select(`
              id, content, created_at, user_id, post_id, parent_id, image_url,
              user:users(username, avatar_url),
              post:posts(title, board:boards(name))
            `)
            .eq("id", item.content_id)
            .single()

          if (commentError || !comment) {
            console.error("Error fetching comment for feed item:", commentError)
            return null
          }

          // Get comment like count
          const { count: likeCount } = await supabase
            .from("comment_likes")
            .select("id", { count: "exact" })
            .eq("comment_id", comment.id)

          return {
            ...item,
            comment: {
              ...comment,
              _count: {
                likes: likeCount || 0,
              },
            },
          }
        }

        return null
      }),
    )

    // Filter out any null items (where content couldn't be fetched)
    const validItems = processedItems.filter((item) => item !== null) as FeedItem[]

    return {
      data: validItems,
      hasMore: count !== null && start + validItems.length < count,
    }
  } catch (error) {
    console.error("Error fetching user feed:", error)
    throw error
  }
}

export async function addToUserFeed(userId: string, contentId: string, contentType: "post" | "comment") {
  const supabase = createClient()

  try {
    // Check if the item is already in the feed
    const { data: existing, error: checkError } = await supabase
      .from("user_feed")
      .select("id")
      .eq("user_id", userId)
      .eq("content_id", contentId)
      .eq("content_type", contentType)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is expected
      throw checkError
    }

    // If already exists, don't add again
    if (existing) {
      return { success: true, message: "Already in feed" }
    }

    // Add to feed
    const { error } = await supabase.from("user_feed").insert({
      user_id: userId,
      content_id: contentId,
      content_type: contentType,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error adding to user feed:", error)
    throw error
  }
}

export async function removeFromUserFeed(feedItemId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("user_feed").delete().eq("id", feedItemId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error removing from user feed:", error)
    throw error
  }
}
