import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

export type Post = Database["public"]["Tables"]["posts"]["Row"]

export interface OldPost {
  id: string
  title: string
  content: string
  user_id: string
  board_id: string
  created_at: string
  updated_at: string | null
  author?: {
    id: string
    username: string
    avatar_url: string | null
    prestige_score?: number | null
    is_admin?: boolean | null
  }
  board?: {
    id: string
    name: string
    chinese_name: string
  }
  comment_count?: number
  like_count?: number
  tags?: string[]
}

/**
 * Get posts with optional filtering
 */
export async function getPosts(options?: {
  boardId?: string
  userId?: string
  limit?: number
  offset?: number
}): Promise<Post[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  let query = supabase.from("posts").select(`
      *,
      author:user_id(id, username, avatar_url, prestige_score, is_admin),
      board:board_id(id, name, chinese_name)
    `)

  if (options?.boardId) {
    query = query.eq("board_id", options.boardId)
  }

  if (options?.userId) {
    query = query.eq("user_id", options.userId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  // Get post tags
  const postsWithTags = await Promise.all(
    (data || []).map(async (post) => {
      const { data: tagData } = await supabase.from("post_tags").select("tag").eq("post_id", post.id)

      const tags = tagData?.map((t) => t.tag) || []

      return {
        ...post,
        tags,
      }
    }),
  )

  return postsWithTags as any
}

/**
 * Get trending posts
 */
export async function getTrendingPosts(limit = 10): Promise<OldPost[]> {
  // In a real app, this would use a more sophisticated algorithm
  // For now, we'll just get the most recent posts
  return getAllPosts().slice(0, limit)
}

/**
 * Get posts by board ID
 */
export async function getPostsByBoardId(boardId: string, limit = 20, offset = 0): Promise<OldPost[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      users:user_id (username, avatar_url),
      boards:board_id (name)
    `)
    .eq("board_id", boardId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data || []
}

/**
 * Get a post by ID
 */
export async function getPostById(id: string): Promise<OldPost | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:user_id(id, username, avatar_url, prestige_score, is_admin),
      board:board_id(id, name, chinese_name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  if (!data) return null

  // Get post tags
  const { data: tagData } = await supabase.from("post_tags").select("tag").eq("post_id", id)

  const tags = tagData?.map((t) => t.tag) || []

  return {
    ...data,
    tags,
  }
}

/**
 * Create a new post
 */
export async function createPost(post: {
  title: string
  content: string
  user_id: string
  board_id: string
  tags?: string[]
}): Promise<OldPost | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  // Start a transaction
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      board_id: post.board_id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    return null
  }

  // Add tags if provided
  if (post.tags && post.tags.length > 0 && data) {
    const tagInserts = post.tags.map((tag) => ({
      post_id: data.id,
      tag,
    }))

    const { error: tagError } = await supabase.from("post_tags").insert(tagInserts)

    if (tagError) {
      console.error("Error adding tags to post:", tagError)
      // We don't return null here because the post was created successfully
    }
  }

  return data
}

/**
 * Update a post
 */
export async function updatePost(
  id: string,
  updates: {
    title?: string
    content?: string
    tags?: string[]
  },
): Promise<OldPost | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  // Update post
  const { data, error } = await supabase
    .from("posts")
    .update({
      title: updates.title,
      content: updates.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating post:", error)
    return null
  }

  // Update tags if provided
  if (updates.tags && data) {
    // First delete existing tags
    const { error: deleteError } = await supabase.from("post_tags").delete().eq("post_id", id)

    if (deleteError) {
      console.error("Error deleting existing tags:", deleteError)
    }

    // Then add new tags
    if (updates.tags.length > 0) {
      const tagInserts = updates.tags.map((tag) => ({
        post_id: id,
        tag,
      }))

      const { error: tagError } = await supabase.from("post_tags").insert(tagInserts)

      if (tagError) {
        console.error("Error adding tags to post:", tagError)
      }
    }
  }

  return data
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  // Delete post (this will cascade delete comments and tags due to foreign key constraints)
  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting post:", error)
    return false
  }

  return true
}

export interface EnhancedPost {
  id: string
  title: string
  content: string
  image_url?: string | null
  user_id: string
  board_id: string
  created_at: string
  updated_at: string | null
  author?: {
    id: string
    username: string
    avatar_url: string | null
    prestige_score?: number | null
    is_admin?: boolean | null
  }
  board?: {
    id: string
    name: string
    chinese_name: string
  }
  comment_count?: number
  like_count?: number
  tags?: string[]
}

/**
 * Get all posts (for admin purposes)
 */
export async function getAllPosts(): Promise<any[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin),
        board:board_id(id, name, chinese_name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all posts:", error)
      return []
    }

    // Format the data for easier display in admin dashboard
    return data.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      user_id: post.user_id,
      board_id: post.board_id,
      created_at: post.created_at,
      updated_at: post.updated_at,
      user_username: post.author?.username || "Unknown User",
      board_name: post.board?.name || "Unknown Board",
    }))
  } catch (error) {
    // Improved error handling for rate limiting and other errors
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.error("Rate limiting error in getAllPosts. Too many requests.")
    } else {
      console.error("Error in getAllPosts:", error)
    }
    return []
  }
}

/**
 * Get posts by user ID
 */
export async function getPostsByUserId(userId: string, limit = 20, offset = 0): Promise<EnhancedPost[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    // First get the posts with comments
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin),
        board:board_id(id, name, chinese_name),
        comments:comments(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching posts by user:", error)
      return []
    }

    // Now get the like counts for each post
    const postsWithLikes = await Promise.all(
      data.map(async (post) => {
        try {
          // Use the post's like_count field directly if it exists
          if (typeof post.like_count === "number") {
            return {
              ...post,
              comment_count: post.comments?.length || 0,
              like_count: post.like_count,
            }
          }

          // Otherwise, try to count from post_likes table if it exists
          const { count, error: likeError } = await supabase
            .from("post_likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id)

          if (likeError) {
            console.error(`Error counting likes for post ${post.id}:`, likeError)
            return {
              ...post,
              comment_count: post.comments?.length || 0,
              like_count: 0,
            }
          }

          return {
            ...post,
            comment_count: post.comments?.length || 0,
            like_count: count || 0,
          }
        } catch (error) {
          console.error(`Error processing likes for post ${post.id}:`, error)
          return {
            ...post,
            comment_count: post.comments?.length || 0,
            like_count: 0,
          }
        }
      }),
    )

    return postsWithLikes
  } catch (error) {
    console.error("Error in getPostsByUserId:", error)
    return []
  }
}

/**
 * Get posts by user ID with pagination (alias for getPostsByUserId for backward compatibility)
 */
export async function getUserPosts(
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<{ data: EnhancedPost[]; hasMore: boolean }> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return { data: [], hasMore: false }

    const offset = (page - 1) * pageSize

    // Get posts with comments
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:user_id(id, username, avatar_url, prestige_score, is_admin),
        board:board_id(id, name, chinese_name),
        comments:comments(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error("Error fetching posts by user:", error)
      return { data: [], hasMore: false }
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)

    if (countError) {
      console.error("Error counting posts:", countError)
      return {
        data: data.map((post) => ({
          ...post,
          comment_count: post.comments?.length || 0,
          like_count: post.like_count || 0,
        })),
        hasMore: false,
      }
    }

    // Now get the like counts for each post
    const postsWithLikes = await Promise.all(
      data.map(async (post) => {
        try {
          // Use the post's like_count field directly if it exists
          if (typeof post.like_count === "number") {
            return {
              ...post,
              comment_count: post.comments?.length || 0,
              like_count: post.like_count,
            }
          }

          // Otherwise, try to count from post_likes table if it exists
          const { count: likeCount, error: likeError } = await supabase
            .from("post_likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id)

          if (likeError) {
            console.error(`Error counting likes for post ${post.id}:`, likeError)
            return {
              ...post,
              comment_count: post.comments?.length || 0,
              like_count: 0,
            }
          }

          return {
            ...post,
            comment_count: post.comments?.length || 0,
            like_count: likeCount || 0,
          }
        } catch (error) {
          console.error(`Error processing likes for post ${post.id}:`, error)
          return {
            ...post,
            comment_count: post.comments?.length || 0,
            like_count: 0,
          }
        }
      }),
    )

    const hasMore = offset + pageSize < (count || 0)

    return {
      data: postsWithLikes,
      hasMore,
    }
  } catch (error) {
    console.error("Error in getUserPosts:", error)
    return { data: [], hasMore: false }
  }
}
