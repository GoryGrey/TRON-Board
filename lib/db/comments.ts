import { getSupabaseClient } from "@/lib/supabase"

export interface Comment {
  id: string
  content: string
  image_url?: string | null
  user_id: string
  post_id: string
  parent_id: string | null
  created_at: string
  updated_at: string | null
  author?: {
    id: string
    username: string
    avatar_url: string | null
    prestige_score?: number | null
    is_admin?: boolean | null
  }
  replies?: Comment[]
  like_count?: number
}

/**
 * Get all comments (for admin purposes)
 */
export async function getAllComments(): Promise<any[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not initialized in getAllComments")
      return []
    }

    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin),
        post:post_id(id, title)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all comments:", error)
      return []
    }

    // Format the data for easier display in admin dashboard
    return data.map((comment) => ({
      id: comment.id,
      content: comment.content,
      image_url: comment.image_url,
      user_id: comment.user_id,
      post_id: comment.post_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      user_username: comment.author?.username || "Unknown User",
      post_title: comment.post?.title || "Unknown Post",
    }))
  } catch (error) {
    // Improved error handling for rate limiting and other errors
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.error("Rate limiting error in getAllComments. Too many requests.")
    } else {
      console.error("Error in getAllComments:", error)
    }
    return []
  }
}

/**
 * Get comments for a post
 */
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching comments:", error)
      return []
    }

    // Organize comments into a tree structure
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: add all comments to the map
    data?.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize into parent-child relationships
    data?.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)
      if (!commentWithReplies) return

      if (comment.parent_id) {
        // This is a reply
        const parentComment = commentMap.get(comment.parent_id)
        if (parentComment && parentComment.replies) {
          parentComment.replies.push(commentWithReplies)
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies)
      }
    })

    return rootComments
  } catch (error) {
    console.error("Error in getCommentsByPostId:", error)
    return []
  }
}

/**
 * Get comments by user ID
 */
export async function getCommentsByUserId(userId: string, limit = 20, offset = 0): Promise<Comment[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching comments by user:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCommentsByUserId:", error)
    return []
  }
}

/**
 * Get comments by user ID (alias for getCommentsByUserId for backward compatibility)
 */
export async function getUserComments(
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<{ comments: Comment[]; count: number }> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return { comments: [], count: 0 }

    const offset = (page - 1) * pageSize

    // Get comments
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin),
        post:post_id(id, title)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error("Error fetching comments by user:", error)
      return { comments: [], count: 0 }
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from("comments")
      .select("id", { count: "exact" })
      .eq("user_id", userId)

    if (countError) {
      console.error("Error counting comments:", countError)
      return { comments: data || [], count: 0 }
    }

    return {
      comments: data || [],
      count: count || 0,
    }
  } catch (error) {
    console.error("Error in getUserComments:", error)
    return { comments: [], count: 0 }
  }
}

/**
 * Create a new comment
 */
export async function createComment(comment: {
  content: string
  image_url?: string | null
  user_id: string
  post_id: string
  parent_id?: string | null
}): Promise<Comment | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: comment.content,
        image_url: comment.image_url || null,
        user_id: comment.user_id,
        post_id: comment.post_id,
        parent_id: comment.parent_id || null,
      })
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin)
      `)
      .single()

    if (error) {
      console.error("Error creating comment:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createComment:", error)
    return null
  }
}

/**
 * Update a comment
 */
export async function updateComment(
  id: string,
  updates: {
    content: string
    image_url?: string | null
  },
): Promise<Comment | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from("comments")
      .update({
        content: updates.content,
        image_url: updates.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin)
      `)
      .single()

    if (error) {
      console.error("Error updating comment:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateComment:", error)
    return null
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return false

    const { error } = await supabase.from("comments").delete().eq("id", id)

    if (error) {
      console.error("Error deleting comment:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteComment:", error)
    return false
  }
}
