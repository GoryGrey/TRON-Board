"use server"

import { getSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { deleteFromStorage } from "@/lib/storage-service"
import { createServerClient } from "@/lib/supabase-server"

// Get all posts with pagination
export async function getPosts(page = 1, limit = 10, boardId?: string) {
  const supabase = getSupabaseClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("posts")
    .select(`
      *,
      users:user_id (username, avatar_url, prestige_score, is_admin, role),
      boards:board_id (id, name, description)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (boardId) {
    query = query.eq("board_id", boardId)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  return { posts: data || [], count }
}

// Get a single post by ID
export async function getPostById(postId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      users:user_id (username, avatar_url, prestige_score, is_admin, role),
      boards:board_id (id, name, description)
    `)
    .eq("id", postId)
    .single()

  if (error) {
    console.error(`Error fetching post ${postId}:`, error)
    throw new Error(`Failed to fetch post: ${error.message}`)
  }

  return data
}

// Get posts by user ID
export async function getPostsByUserId(userId: string, page = 1, limit = 10) {
  const supabase = getSupabaseClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("posts")
    .select(
      `
      *,
      users:user_id (username, avatar_url, prestige_score, is_admin, role),
      boards:board_id (id, name, description)
    `,
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }

  return { posts: data || [], count }
}

// Create a new post
export async function createPost(post: {
  title: string
  content: string
  user_id: string
  board_id: string
  image_url?: string
  tags?: string[]
}) {
  console.log("Server: Creating post with data:", {
    title: post.title,
    content: post.content.substring(0, 50) + "...", // Log truncated content
    user_id: post.user_id,
    board_id: post.board_id,
    has_image: !!post.image_url,
    tags_count: post.tags?.length || 0,
  })

  try {
    // Validate board_id is a valid UUID
    if (!post.board_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.board_id)) {
      console.error("Invalid board_id format:", post.board_id)
      throw new Error("Invalid board ID format")
    }

    // Validate user_id is present
    if (!post.user_id) {
      console.error("Missing user_id")
      throw new Error("User ID is required")
    }

    // Use the server-side client with service role to bypass RLS
    // This ensures we can create posts even if the client's auth token has issues
    const supabase = createServerClient()

    // First, insert the post with only the required columns
    const postData = {
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      board_id: post.board_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any

    // Only add image_url if it's provided and not empty
    if (post.image_url && post.image_url.trim() !== "") {
      postData.image_url = post.image_url
    }

    console.log("Server: Inserting post data with keys:", Object.keys(postData))

    // Insert without tags first to avoid potential schema issues
    const { data, error } = await supabase.from("posts").insert(postData).select("id").single()

    if (error) {
      console.error("Error creating post:", error)
      throw new Error(`Failed to create post: ${error.message}`)
    }

    if (!data || !data.id) {
      console.error("No post ID returned from insert")
      throw new Error("Post creation failed - no ID returned")
    }

    console.log("Server: Post created successfully with ID:", data.id)

    // Handle tags separately only if post creation succeeded
    if (post.tags && post.tags.length > 0) {
      try {
        // Check if post_tags table exists before attempting to insert
        const { error: tableCheckError } = await supabase.from("post_tags").select("post_id").limit(1)

        if (tableCheckError) {
          console.error("post_tags table may not exist:", tableCheckError)
        } else {
          const tagInserts = post.tags.map((tag) => ({
            post_id: data.id,
            tag: tag.trim().toLowerCase(),
          }))

          console.log("Server: Inserting tags:", tagInserts)

          // Replace the fire and forget pattern with proper await
          try {
            console.log("🕒 Starting tag insertion at", new Date().toISOString())
            const { error: tagError } = await supabase.from("post_tags").insert(tagInserts)

            if (tagError) {
              console.error("Error adding tags:", tagError)
            } else {
              console.log("✅ Tags inserted successfully at", new Date().toISOString())
            }
          } catch (tagInsertError) {
            console.error("Non-blocking tag insert error:", tagInsertError)
            // Continue despite tag insertion errors
          }
        }
      } catch (tagError) {
        console.error("Error in tag insertion:", tagError)
        // Continue despite tag insertion errors
      }
    }

    // Revalidate the paths
    try {
      revalidatePath("/posts")
      revalidatePath(`/boards/${post.board_id}`)
      revalidatePath(`/profile`) // Revalidate the profile page to show the new post
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError)
      // Continue despite revalidation errors
    }

    // Return minimal post data to ensure client can navigate
    return {
      id: data.id,
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      board_id: post.board_id,
      created_at: postData.created_at,
      image_url: postData.image_url,
    }
  } catch (error) {
    console.error("Server: Error in createPost:", error)
    // Return a minimal post object to prevent client-side errors
    return {
      id: "error",
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      board_id: post.board_id,
      created_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Update a post
export async function updatePost(
  postId: string,
  userId: string,
  updates: {
    title?: string
    content?: string
    image_url?: string | null
    tags?: string[]
  },
) {
  const supabase = getSupabaseClient()

  // First check if the user is the author of the post
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("user_id, board_id")
    .eq("id", postId)
    .single()

  if (fetchError) {
    console.error(`Error fetching post ${postId}:`, fetchError)
    throw new Error(`Failed to fetch post: ${fetchError.message}`)
  }

  if (post.user_id !== userId) {
    throw new Error("You are not authorized to update this post")
  }

  // Create update data with only valid columns
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.content !== undefined) updateData.content = updates.content
  if (updates.image_url !== undefined) updateData.image_url = updates.image_url

  // Update the post
  const { data, error } = await supabase.from("posts").update(updateData).eq("id", postId).select().single()

  if (error) {
    console.error(`Error updating post ${postId}:`, error)
    throw new Error(`Failed to update post: ${error.message}`)
  }

  // If tags are provided, update them
  if (updates.tags !== undefined) {
    // First delete existing tags
    const { error: deleteError } = await supabase.from("post_tags").delete().eq("post_id", postId)

    if (deleteError) {
      console.error(`Error deleting tags for post ${postId}:`, deleteError)
      // Continue despite error
    }

    // Then add new tags if any
    if (updates.tags.length > 0) {
      const tagInserts = updates.tags.map((tag) => ({
        post_id: postId,
        tag: tag.trim().toLowerCase(),
      }))

      const { error: insertError } = await supabase.from("post_tags").insert(tagInserts)

      if (insertError) {
        console.error(`Error inserting tags for post ${postId}:`, insertError)
        // Continue despite error
      }
    }
  }

  // Revalidate the post page
  revalidatePath(`/posts/${postId}`)

  return data
}

// Delete a post
export async function deletePost(postId: string, userId: string) {
  const supabase = getSupabaseClient()

  // First check if the user is the author of the post
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("user_id, board_id, image_url")
    .eq("id", postId)
    .single()

  if (fetchError) {
    console.error(`Error fetching post ${postId}:`, fetchError)
    throw new Error(`Failed to fetch post: ${fetchError.message}`)
  }

  if (post.user_id !== userId) {
    throw new Error("You are not authorized to delete this post")
  }

  // Delete the post
  const { error } = await supabase.from("posts").delete().eq("id", postId)

  if (error) {
    console.error(`Error deleting post ${postId}:`, error)
    throw new Error(`Failed to delete post: ${error.message}`)
  }

  // If the post had an image, delete it from storage
  if (post.image_url) {
    try {
      // Extract the path from the URL
      const url = new URL(post.image_url)
      const path = url.pathname.split("/").slice(3).join("/")

      if (path) {
        await deleteFromStorage(path)
      }
    } catch (error) {
      console.error("Error deleting post image:", error)
      // Continue despite error
    }
  }

  // Revalidate the posts page and board page
  revalidatePath("/posts")
  revalidatePath(`/boards/${post.board_id}`)

  return { success: true }
}

// Like a post
export async function likePost(postId: string, userId: string) {
  const supabase = getSupabaseClient()

  // Check if the user has already liked the post
  const { data: existingLike, error: likeCheckError } = await supabase
    .from("post_likes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle()

  if (likeCheckError) {
    console.error("Error checking post like:", likeCheckError)
    throw new Error(`Failed to check post like: ${likeCheckError.message}`)
  }

  // If the user has already liked the post, remove the like
  if (existingLike) {
    const { error: unlikeError } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId)

    if (unlikeError) {
      console.error("Error removing post like:", unlikeError)
      throw new Error(`Failed to remove post like: ${unlikeError.message}`)
    }

    // Decrement the like count if the column exists
    try {
      const { error: updateError } = await supabase.rpc("decrement_post_likes", { post_id: postId })
      if (updateError) throw updateError
    } catch (error) {
      console.error("Error decrementing post likes (column may not exist):", error)
      // Continue despite error
    }

    // Revalidate the post page
    revalidatePath(`/posts/${postId}`)

    return { liked: false, likeCount: await getPostLikeCount(postId) }
  }

  // If the user hasn't liked the post, add a like
  const { error: likeError } = await supabase.from("post_likes").insert({
    post_id: postId,
    user_id: userId,
    created_at: new Date().toISOString(),
  })

  if (likeError) {
    console.error("Error adding post like:", likeError)
    throw new Error(`Failed to add post like: ${likeError.message}`)
  }

  // Increment the like count if the column exists
  try {
    const { error: updateError } = await supabase.rpc("increment_post_likes", { post_id: postId })
    if (updateError) throw updateError
  } catch (error) {
    console.error("Error incrementing post likes (column may not exist):", error)
    // Continue despite error
  }

  // Revalidate the post page
  revalidatePath(`/posts/${postId}`)

  return { liked: true, likeCount: await getPostLikeCount(postId) }
}

// Get post like count
async function getPostLikeCount(postId: string) {
  const supabase = getSupabaseClient()

  try {
    // Try to get the like_count from the posts table
    const { data, error } = await supabase.from("posts").select("like_count").eq("id", postId).single()

    if (error) throw error

    return data.like_count || 0
  } catch (error) {
    // If the column doesn't exist, count the likes manually
    console.error("Error fetching post like count (column may not exist):", error)

    const { count, error: countError } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)

    if (countError) {
      console.error("Error counting post likes:", countError)
      return 0
    }

    return count || 0
  }
}

// Check if a user has liked a post
export async function hasUserLikedPost(postId: string, userId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("post_likes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    console.error("Error checking post like:", error)
    throw new Error(`Failed to check post like: ${error.message}`)
  }

  return !!data
}
