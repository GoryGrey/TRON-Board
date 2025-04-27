import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

export type Board = Database["public"]["Tables"]["boards"]["Row"]

export async function getBoards() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("boards").select("*").order("name")

    if (error) {
      console.error("Error fetching boards:", error)
      throw new Error("Failed to fetch boards")
    }

    return data || []
  } catch (error) {
    // Improved error handling for rate limiting and other errors
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.error("Rate limiting error in getBoards. Too many requests.")
      return []
    } else {
      console.error("Error in getBoards:", error)
      throw error
    }
  }
}

export async function getBoardById(id: string): Promise<Board | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("boards").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching board:", error)
    return null
  }

  return data
}

export async function getBoardBySlug(slug: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("boards").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching board by slug:", error)
      throw new Error("Failed to fetch board")
    }

    return data
  } catch (error) {
    console.error("Error in getBoardBySlug:", error)
    throw error
  }
}

export async function getTronBoards(): Promise<Board[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("boards").select("*").eq("is_tron", true).order("name")

  if (error) {
    console.error("Error fetching TRON boards:", error)
    return []
  }

  return data || []
}

export async function getNonTronBoards(): Promise<Board[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("boards").select("*").eq("is_tron", false).order("name")

  if (error) {
    console.error("Error fetching non-TRON boards:", error)
    return []
  }

  return data || []
}

// Add the missing functions needed for the admin dashboard
export async function getAllBoards() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("boards").select("*").order("name")

    if (error) {
      console.error("Error fetching all boards:", error)
      throw new Error("Failed to fetch all boards")
    }

    return data || []
  } catch (error) {
    // Improved error handling for rate limiting and other errors
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.error("Rate limiting error in getAllBoards. Too many requests.")
      return []
    } else {
      console.error("Error in getAllBoards:", error)
      throw error
    }
  }
}

export async function createBoard(name: string, description: string, slug: string) {
  try {
    // Use the regular client instead of server client
    const supabase = createClient()

    const { data, error } = await supabase.from("boards").insert([{ name, description, slug }]).select().single()

    if (error) {
      console.error("Error creating board:", error)
      throw new Error("Failed to create board")
    }

    return data
  } catch (error) {
    console.error("Error in createBoard:", error)
    throw error
  }
}

export async function updateBoard(
  id: string,
  updates: {
    name?: string
    chinese_name?: string
    description?: string
    is_tron?: boolean
  },
): Promise<Board | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("boards").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating board:", error)
    return null
  }

  return data
}

export async function deleteBoard(boardId: string) {
  try {
    // Use the regular client instead of server client
    const supabase = createClient()

    // First delete all posts associated with this board
    const { error: postsError } = await supabase.from("posts").delete().eq("board_id", boardId)

    if (postsError) {
      console.error("Error deleting board posts:", postsError)
      throw new Error("Failed to delete board posts")
    }

    // Then delete the board
    const { error } = await supabase.from("boards").delete().eq("id", boardId)

    if (error) {
      console.error("Error deleting board:", error)
      throw new Error("Failed to delete board")
    }

    return true
  } catch (error) {
    console.error("Error in deleteBoard:", error)
    throw error
  }
}
