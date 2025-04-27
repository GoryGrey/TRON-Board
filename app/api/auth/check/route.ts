import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function GET() {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  })

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (profileError) {
    console.error("Error fetching user profile:", profileError)
    return NextResponse.json({ authenticated: true, user: session.user, profile: null }, { status: 200 })
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: session.user,
      profile,
      isAdmin: profile.role === "admin" || profile.is_admin === true,
    },
    { status: 200 },
  )
}
