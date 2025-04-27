import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10)
  console.log(`[${requestId}] API: Received request to create ad`)

  let supabase = null

  try {
    // Get the session from the request
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid session" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Create a Supabase client with the service role key
    supabase = createClient<Database>(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          persistSession: false,
        },
      },
    )

    // Verify the token and check if the user is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error(`[${requestId}] API: Authentication error:`, authError)
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 })
    }

    // Check if the user is an admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_admin, role")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      console.error(`[${requestId}] API: User data error:`, userError)
      return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 })
    }

    if (!userData.is_admin && userData.role !== "admin") {
      console.error(`[${requestId}] API: User is not an admin`)
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    // Parse the request body
    const body = await request.json()
    const { title, description, url, imageUrl } = body

    console.log(`[${requestId}] API: Request body from admin user:`, {
      title,
      description: description ? "provided" : "not provided",
      url,
      imageUrl: imageUrl ? "provided" : "not provided",
    })

    if (!title || !url) {
      console.log(`[${requestId}] API: Validation failed: Missing title or URL`)
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 })
    }

    console.log(`[${requestId}] API: About to insert ad into database`)

    // Set a timeout for the database operation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log(`[${requestId}] API: Database operation timed out after 15 seconds`)
      controller.abort()
    }, 15000)

    const startTime = Date.now()

    try {
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
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

      const duration = Date.now() - startTime
      console.log(`[${requestId}] API: Database operation completed in ${duration}ms`)

      if (error) {
        console.error(`[${requestId}] API: Error creating ad:`, error)
        return NextResponse.json({ error: error.message || "Failed to create ad" }, { status: 500 })
      }

      console.log(`[${requestId}] API: Ad created successfully by admin user`)

      return NextResponse.json({
        success: true,
        data: data[0],
      })
    } catch (dbError) {
      clearTimeout(timeoutId)

      if (dbError.name === "AbortError") {
        console.error(`[${requestId}] API: Operation timed out`)
        return NextResponse.json({ error: "Database operation timed out" }, { status: 504 })
      }

      console.error(`[${requestId}] API: Database operation error:`, dbError)
      return NextResponse.json(
        { error: dbError instanceof Error ? dbError.message : "Database operation failed" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error(`[${requestId}] API: Error in create ad API route:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
