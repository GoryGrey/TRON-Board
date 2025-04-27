"use server"

import { getSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get user feed items
export async function getUserFeed(userId: string, page = 1, limit = 10) {
  const supabase = getSupabaseClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("user_feeds")
    .select(
      `
      *
    `,
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching feed for user ${userId}:`, error)
    throw new Error(`Failed to fetch user feed: ${error.message}`)
  }

  // Now we need to fetch the actual content (posts or comments)
  const feedItems = []

  for (const item of data || []) {
    if (item.content_type === "post") {
      try {
        const { data: post } = await supabase
          .from("posts")
          .select(`
            *,
            users:user_id (username, avatar_url, prestige_score, is_admin, role),
            boards:board_id (id, name, description)
          `)
          .eq("id", item.content_id)
          .single()

        if (post) {
          feedItems.push({
            id: item.id,
            type: "post",
            content: post,
            created_at: item.created_at,
          })
        }
      } catch (err) {
        console.error(`Error fetching post ${item.content_id}:`, err)
        // Skip this item if there's an error
      }
    } else if (item.content_type === "comment") {
      try {
        const { data: comment } = await supabase
          .from("comments")
          .select(`
            *,
            users:user_id (username, avatar_url, prestige_score, is_admin, role),
            posts:post_id (id, title)
          `)
          .eq("id", item.content_id)
          .single()

        if (comment) {
          feedItems.push({
            id: item.id,
            type: "comment",
            content: comment,
            created_at: item.created_at,
          })
        }
      } catch (err) {
        console.error(`Error fetching comment ${item.content_id}:`, err)
        // Skip this item if there's an error
      }
    }
  }

  return { feedItems, count }
}

// Share a post to user feed
export async function sharePostToFeed(userId: string, postId: string) {
  const supabase = getSupabaseClient()

  // Check if the post exists
  const { data: post, error: postError } = await supabase.from("posts").select("id").eq("id", postId).single()

  if (postError) {
    console.error(`Error fetching post ${postId}:`, postError)
    throw new Error(`Failed to fetch post: ${postError.message}`)
  }

  // Check if the post is already in the user's feed
  const { data: existingShare, error: shareCheckError } = await supabase
    .from("user_feeds")
    .select()
    .eq("user_id", userId)
    .eq("content_id", postId)
    .eq("content_type", "post")
    .maybeSingle()

  if (shareCheckError) {
    console.error("Error checking post share:", shareCheckError)
    throw new Error(`Failed to check post share: ${shareCheckError.message}`)
  }

  // If the post is already in the user's feed, return early
  if (existingShare) {
    return { success: true, message: "Post is already in your feed" }
  }

  // Add the post to the user's feed
  const { error } = await supabase.from("user_feeds").insert({
    user_id: userId,
    content_id: postId,
    content_type: "post",
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error sharing post to feed:", error)
    throw new Error(`Failed to share post to feed: ${error.message}`)
  }

  // Revalidate the profile page
  revalidatePath(`/profile`)

  return { success: true, message: "Post shared to your feed" }
}

// Share a comment to user feed
export async function shareCommentToFeed(userId: string, commentId: string) {
  const supabase = getSupabaseClient()

  // Check if the comment exists
  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("id")
    .eq("id", commentId)
    .single()

  if (commentError) {
    console.error(`Error fetching comment ${commentId}:`, commentError)
    throw new Error(`Failed to fetch comment: ${commentError.message}`)
  }

  // Check if the comment is already in the user's feed
  const { data: existingShare, error: shareCheckError } = await supabase
    .from("user_feeds")
    .select()
    .eq("user_id", userId)
    .eq("content_id", commentId)
    .eq("content_type", "comment")
    .maybeSingle()

  if (shareCheckError) {
    console.error("Error checking comment share:", shareCheckError)
    throw new Error(`Failed to check comment share: ${shareCheckError.message}`)
  }

  // If the comment is already in the user's feed, return early
  if (existingShare) {
    return { success: true, message: "Comment is already in your feed" }
  }

  // Add the comment to the user's feed
  const { error } = await supabase.from("user_feeds").insert({
    user_id: userId,
    content_id: commentId,
    content_type: "comment",
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error sharing comment to feed:", error)
    throw new Error(`Failed to share comment to feed: ${error.message}`)
  }

  // Revalidate the profile page
  revalidatePath(`/profile`)

  return { success: true, message: "Comment shared to your feed" }
}

// Remove an item from user feed
export async function removeFromFeed(userId: string, feedItemId: string) {
  const supabase = getSupabaseClient()

  // Check if the feed item belongs to the user
  const { data: feedItem, error: feedItemError } = await supabase
    .from("user_feeds")
    .select("user_id")
    .eq("id", feedItemId)
    .single()

  if (feedItemError) {
    console.error(`Error fetching feed item ${feedItemId}:`, feedItemError)
    throw new Error(`Failed to fetch feed item: ${feedItemError.message}`)
  }

  if (feedItem.user_id !== userId) {
    throw new Error("You are not authorized to remove this item from your feed")
  }

  // Remove the item from the user's feed
  const { error } = await supabase.from("user_feeds").delete().eq("id", feedItemId)

  if (error) {
    console.error(`Error removing item from feed:`, error)
    throw new Error(`Failed to remove item from feed: ${error.message}`)
  }

  // Revalidate the profile page
  revalidatePath(`/profile`)

  return { success: true, message: "Item removed from your feed" }
}
