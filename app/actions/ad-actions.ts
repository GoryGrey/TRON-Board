"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function createAdAction(formData: FormData) {
  const actionId = Math.random().toString(36).substring(2, 10)
  console.log(`[${actionId}] Action: Creating ad`)

  try {
    // Get the session cookie
    const supabaseCookie = cookies().get("sb-access-token")?.value

    if (!supabaseCookie) {
      console.error(`[${actionId}] Action: No session cookie found`)
      return { success: false, error: "Unauthorized: No valid session" }
    }

    // Create a Supabase client with the service role key
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          persistSession: false,
        },
      },
    )

    // Verify the session and check if the user is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(supabaseCookie)

    if (authError || !user) {
      console.error(`[${actionId}] Action: Authentication error:`, authError)
      return { success: false, error: "Unauthorized: Invalid session" }
    }

    // Check if the user is an admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_admin, role")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      console.error(`[${actionId}] Action: User data error:`, userError)
      return { success: false, error: "Unauthorized: User not found" }
    }

    if (!userData.is_admin && userData.role !== "admin") {
      console.error(`[${actionId}] Action: User is not an admin`)
      return { success: false, error: "Forbidden: Admin access required" }
    }

    // Get form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const imageUrl = formData.get("imageUrl") as string

    if (!title || !url) {
      console.log(`[${actionId}] Action: Validation failed: Missing title or URL`)
      return { success: false, error: "Title and URL are required" }
    }

    console.log(`[${actionId}] Action: About to insert ad into database`)

    // Insert the ad using the service role client (bypasses RLS)
    const { data, error } = await supabase
      .from("ads")
      .insert({
        title,
        description: description || "",
        url,
        image_url: imageUrl || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error(`[${actionId}] Action: Error creating ad:`, error)
      return { success: false, error: error.message || "Failed to create ad" }
    }

    console.log(`[${actionId}] Action: Ad created successfully by admin user`)

    return { success: true, data: data[0] }
  } catch (error) {
    console.error(`[${actionId}] Action: Error in create ad action:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
