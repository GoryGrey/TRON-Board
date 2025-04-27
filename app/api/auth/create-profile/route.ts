import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.id || !userData.email || !userData.username) {
      return NextResponse.json({ error: "Missing required user data" }, { status: 400 })
    }

    // Insert user profile using the admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        avatar_url: userData.avatar_url || "/placeholder.svg?height=96&width=96",
        prestige_score: userData.prestige_score || 0,
        is_admin: userData.is_admin || false,
        role: userData.role || "user",
      })
      .select()

    if (error) {
      console.error("Error creating user profile:", error)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in create-profile route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
