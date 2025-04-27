import { getSupabaseClient } from "@/lib/supabase"

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase.from("post_tags").select("tag").order("tag")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  // Extract unique tags
  const uniqueTags = [...new Set(data.map((item) => item.tag))]
  return uniqueTags
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string, limit = 20, offset = 0) {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  // First get post IDs with this tag
  const { data: tagData, error: tagError } = await supabase
    .from("post_tags")
    .select("post_id")
    .eq("tag", tag)
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (tagError) {
    console.error("Error fetching posts by tag:", tagError)
    return []
  }

  if (!tagData || tagData.length === 0) {
    return []
  }

  // Then get the actual posts
  const postIds = tagData.map((item) => item.post_id)
  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select(`
      *,
      author:user_id(id, username, avatar_url, prestige_score, is_admin),
      board:board_id(id, name, chinese_name)
    `)
    .in("id", postIds)
    .order("created_at", { ascending: false })

  if (postsError) {
    console.error("Error fetching posts by IDs:", postsError)
    return []
  }

  // Get tags for each post
  const postsWithTags = await Promise.all(
    (postsData || []).map(async (post) => {
      const { data: postTagData } = await supabase.from("post_tags").select("tag").eq("post_id", post.id)

      const tags = postTagData?.map((t) => t.tag) || []

      return {
        ...post,
        tags,
      }
    }),
  )

  return postsWithTags
}

/**
 * Get popular tags
 */
export async function getPopularTags(limit = 10): Promise<{ tag: string; count: number }[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  // This query would be more efficient with a SQL function, but we'll do it client-side for now
  const { data, error } = await supabase.from("post_tags").select("tag")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  // Count occurrences of each tag
  const tagCounts: Record<string, number> = {}
  data.forEach((item) => {
    tagCounts[item.tag] = (tagCounts[item.tag] || 0) + 1
  })

  // Convert to array and sort by count
  const sortedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  return sortedTags
}
