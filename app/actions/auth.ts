"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/database.types"

// Create a server-side Supabase client with cookies
const getServerSupabaseClient = () => {
  const cookieStore = cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are not available")
    return null
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Create a server-side Supabase admin client with service role key
const getServiceRoleClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase service role environment variables are not available")
    return null
  }

  return createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function signUp(email: string, username: string, password: string) {
  const supabase = getServerSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not available" }

  try {
    // Check if username is already taken
    const { data: existingUser, error: usernameCheckError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle()

    if (usernameCheckError) {
      return { success: false, error: usernameCheckError.message }
    }

    if (existingUser) {
      return { success: false, error: "Username is already taken" }
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "Failed to create user" }
    }

    // Use service role client to create user profile (bypasses RLS)
    const serviceClient = getServiceRoleClient()
    if (!serviceClient) {
      return { success: false, error: "Service role client not available" }
    }

    const { error: profileError } = await serviceClient.from("users").insert({
      id: data.user.id,
      email,
      username,
      avatar_url: "/placeholder.svg?height=96&width=96",
      prestige_score: 0,
      is_admin: false,
      role: "user",
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      return { success: false, error: "Failed to create user profile: " + profileError.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error signing up:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function signIn(email: string, password: string) {
  const supabase = getServerSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not available" }

  try {
    console.log("Server action: Attempting to sign in with email:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Server action: Sign in error:", error.message)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "No user returned from authentication" }
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Server action: Error fetching user profile:", profileError.message)
      return { success: false, error: "Failed to fetch user profile" }
    }

    return { success: true, user: data.user, profile }
  } catch (error) {
    console.error("Server action: Error signing in:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function signOut() {
  const supabase = getServerSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not available" }

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getCurrentUser() {
  const supabase = getServerSupabaseClient()
  if (!supabase) return null

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: user, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    username?: string
    avatar_url?: string
    bio?: string
  },
) {
  // Use the service role client to bypass RLS policies
  const serviceClient = getServiceRoleClient()
  if (!serviceClient) return { success: false, error: "Service role client not available" }

  try {
    // First check if the user exists in auth.users
    const { data: authUser, error: authError } = await serviceClient.auth.admin.getUserById(userId)

    if (authError) {
      console.error("Error checking auth user:", authError)
      return { success: false, error: authError.message }
    }

    if (!authUser || !authUser.user) {
      return { success: false, error: "User not found in auth system" }
    }

    // Now check if the user exists in public.users
    const { data: existingProfile, error: profileCheckError } = await serviceClient
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (profileCheckError && profileCheckError.code !== "PGRST116") {
      console.error("Error checking user profile:", profileCheckError)
      return { success: false, error: profileCheckError.message }
    }

    let result

    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await serviceClient
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error("Error updating user profile:", updateError)
        return { success: false, error: updateError.message }
      }

      result = updatedProfile
    } else {
      // Create new profile
      const { data: newProfile, error: insertError } = await serviceClient
        .from("users")
        .insert({
          id: userId,
          email: authUser.user.email,
          username: updates.username || authUser.user.email?.split("@")[0] || "user",
          avatar_url: updates.avatar_url || "/placeholder.svg?height=96&width=96",
          bio: updates.bio || "",
          prestige_score: 0,
          is_admin: false,
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle()

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        return { success: false, error: insertError.message }
      }

      result = newProfile
    }

    // Revalidate the profile page to show updated information
    revalidatePath(`/profile/${userId}`)
    revalidatePath(`/profile`)
    revalidatePath(`/settings`)

    return { success: true, user: result }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
