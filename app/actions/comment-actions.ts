"use server"

import { getSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get comments for a post with pagination
export async function getCommentsByPostId(postId: string, page = 1, limit = 10) {
  const supabase = getSupabaseClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("comments")
    .select(
      `
      *,
      users:user_id (username, avatar_url, prestige_score, is_admin, role)
    `,
      { count: "exact" },
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    throw new Error(`Failed to fetch comments: ${error.message}`)
  }

  return { comments: data || [], count }
}

// Get comments by user ID
export async function getCommentsByUserId(userId: string, page = 1, limit = 10) {
  const supabase = getSupabaseClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("comments")
    .select(
      `
      *,
      users:user_id (username, avatar_url, prestige_score, is_admin, role),
      posts:post_id (id, title)
    `,
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching comments for user ${userId}:`, error)
    throw new Error(`Failed to fetch user comments: ${error.message}`)
  }

  return { comments: data || [], count }
}

// Create a new comment
export async function createComment(comment: {
  user_id: string
  post_id: string
  content: string
  parent_id?: string | null
  image_url?: string | null
}) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: comment.user_id,
      post_id: comment.post_id,
      parent_id: comment.parent_id || null,
      content: comment.content,
      image_url: comment.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      like_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating comment:", error)
    throw new Error(`Failed to create comment: ${error.message}`)
  }

  // Increment the comment count on the post
  const { error: updateError } = await supabase.rpc("increment_post_comments", { post_id: comment.post_id })

  if (updateError) {
    console.error("Error incrementing post comment count:", updateError)
    // Don't throw here, we still want to return the comment
  }

  // Revalidate the post page
  revalidatePath(`/posts/${comment.post_id}`)

  return data
}

// Update a comment
export async function updateComment(
  commentId: string,
  userId: string,
  updates: {
    content: string
    image_url?: string | null
  },
) {
  const supabase = getSupabaseClient()

  // First check if the user is the author of the comment
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id, post_id")
    .eq("id", commentId)
    .single()

  if (fetchError) {
    console.error(`Error fetching comment ${commentId}:`, fetchError)
    throw new Error(`Failed to fetch comment: ${fetchError.message}`)
  }

  if (comment.user_id !== userId) {
    throw new Error("You are not authorized to update this comment")
  }

  const { data, error } = await supabase
    .from("comments")
    .update({
      content: updates.content,
      image_url: updates.image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .select()
    .single()

  if (error) {
    console.error(`Error updating comment ${commentId}:`, error)
    throw new Error(`Failed to update comment: ${error.message}`)
  }

  // Revalidate the post page
  revalidatePath(`/posts/${comment.post_id}`)

  return data
}

// Delete a comment
export async function deleteComment(commentId: string, userId: string) {
  const supabase = getSupabaseClient()

  // First check if the user is the author of the comment
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id, post_id")
    .eq("id", commentId)
    .single()

  if (fetchError) {
    console.error(`Error fetching comment ${commentId}:`, fetchError)
    throw new Error(`Failed to fetch comment: ${fetchError.message}`)
  }

  if (comment.user_id !== userId) {
    throw new Error("You are not authorized to delete this comment")
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId)

  if (error) {
    console.error(`Error deleting comment ${commentId}:`, error)
    throw new Error(`Failed to delete comment: ${error.message}`)
  }

  // Decrement the comment count on the post
  const { error: updateError } = await supabase.rpc("decrement_post_comments", { post_id: comment.post_id })

  if (updateError) {
    console.error("Error decrementing post comment count:", updateError)
    // Don't throw here, we still want to return success
  }

  // Revalidate the post page
  revalidatePath(`/posts/${comment.post_id}`)

  return { success: true }
}

// Like a comment
export async function likeComment(commentId: string, userId: string) {
  const supabase = getSupabaseClient()

  // Check if the user has already liked the comment
  const { data: existingLike, error: likeCheckError } = await supabase
    .from("comment_likes")
    .select()
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle()

  if (likeCheckError) {
    console.error("Error checking comment like:", likeCheckError)
    throw new Error(`Failed to check comment like: ${likeCheckError.message}`)
  }

  // Get the post_id for the comment for revalidation
  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("post_id")
    .eq("id", commentId)
    .single()

  if (commentError) {
    console.error(`Error fetching comment ${commentId}:`, commentError)
    throw new Error(`Failed to fetch comment: ${commentError.message}`)
  }

  // If the user has already liked the comment, remove the like
  if (existingLike) {
    const { error: unlikeError } = await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId)

    if (unlikeError) {
      console.error("Error removing comment like:", unlikeError)
      throw new Error(`Failed to remove comment like: ${unlikeError.message}`)
    }

    // Decrement the like count
    const { error: updateError } = await supabase.rpc("decrement_comment_likes", { comment_id: commentId })

    if (updateError) {
      console.error("Error decrementing comment likes:", updateError)
      throw new Error(`Failed to update comment like count: ${updateError.message}`)
    }

    // Revalidate the post page
    revalidatePath(`/posts/${comment.post_id}`)

    return { liked: false, likeCount: await getCommentLikeCount(commentId) }
  }

  // If the user hasn't liked the comment, add a like
  const { error: likeError } = await supabase.from("comment_likes").insert({
    comment_id: commentId,
    user_id: userId,
    created_at: new Date().toISOString(),
  })

  if (likeError) {
    console.error("Error adding comment like:", likeError)
    throw new Error(`Failed to add comment like: ${likeError.message}`)
  }

  // Increment the like count
  const { error: updateError } = await supabase.rpc("increment_comment_likes", { comment_id: commentId })

  if (updateError) {
    console.error("Error incrementing comment likes:", updateError)
    throw new Error(`Failed to update comment like count: ${updateError.message}`)
  }

  // Revalidate the post page
  revalidatePath(`/posts/${comment.post_id}`)

  return { liked: true, likeCount: await getCommentLikeCount(commentId) }
}

// Get comment like count
async function getCommentLikeCount(commentId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("comments").select("like_count").eq("id", commentId).single()

  if (error) {
    console.error(`Error fetching comment like count for ${commentId}:`, error)
    throw new Error(`Failed to fetch comment like count: ${error.message}`)
  }

  return data.like_count
}

// Check if a user has liked a comment
export async function hasUserLikedComment(commentId: string, userId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("comment_likes")
    .select()
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    console.error("Error checking comment like:", error)
    throw new Error(`Failed to check comment like: ${error.message}`)
  }

  return !!data
}
