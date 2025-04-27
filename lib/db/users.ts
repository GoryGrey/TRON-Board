import { createClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"

// Create a Supabase client with the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (typeof window === "undefined" && (!supabaseUrl || !supabaseServiceKey)) {
  console.warn("Missing Supabase environment variables for server operations")
}

// Create a Supabase client with the service role key for server-side operations
const supabaseAdmin = createClient<Database>(supabaseUrl || "", supabaseServiceKey || "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export interface User {
  id: string
  username: string
  email: string
  avatar_url: string | null
  bio: string | null
  prestige_score: number | null
  reputation: number | null
  is_admin: boolean | null
  role: string | null
  created_at: string
  updated_at: string | null
}

export async function fetchUserProfile(userIdOrUsername: string) {
  try {
    // Check if the input is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isUuid = uuidRegex.test(userIdOrUsername)

    let userData

    if (isUuid) {
      // If it's a UUID, query by ID
      const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", userIdOrUsername).single()

      if (error) {
        console.error("Error fetching user by ID:", error)
        throw error
      }

      userData = data
    } else {
      // If it's not a UUID, query by username
      const { data, error } = await supabaseAdmin.from("users").select("*").eq("username", userIdOrUsername).single()

      if (error) {
        console.error("Error fetching user by username:", error)
        throw error
      }

      userData = data
    }

    return userData
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.error("Rate limiting error in fetchUserProfile. Too many requests.")
      return null
    }
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export async function getUserById(userId: string) {
  if (!userId) return null

  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  if (!email) return null

  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

    if (error) {
      console.error("Error fetching user by email:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserByEmail:", error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  if (!username) return null

  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching user by username:", error)
      return null
    }

    return data
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.error("Rate limiting error in getUserByUsername. Too many requests.")
      return null
    }
    console.error("Error fetching user by username:", error)
    return null
  }
}

export async function getAllUsers(limit = 20, offset = 0): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("prestige_score", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error in getAllUsers:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return []
  }
}

export async function updateUserPrestigeScore(userId: string, amount: number): Promise<boolean> {
  try {
    // First get the current prestige score
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("prestige_score")
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching user prestige score:", fetchError)
      return false
    }

    const currentScore = user?.prestige_score || 0
    const newScore = Math.max(0, currentScore + amount) // Ensure score doesn't go below 0

    // Update the prestige score
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ prestige_score: newScore, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating user prestige score:", updateError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateUserPrestigeScore:", error)
    return false
  }
}

export async function updateUserRole(userId: string, role: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("users")
      .update({ role: role, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      console.error("Error updating user role:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateUserRole:", error)
    return false
  }
}

export async function getCurrentUser() {
  try {
    // This function should be called from client components
    // that handle authentication state themselves
    console.warn("getCurrentUser() should be called from client components")
    return null
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}
