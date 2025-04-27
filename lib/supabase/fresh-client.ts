import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// This function creates a new client for each API request
// and should only be used in API routes
export function createFreshClient() {
  console.log("Creating a fresh Supabase client for API route")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for service role")
  }

  // Use a unique storage key for each client to prevent conflicts
  const uniqueKey = `supabase-api-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      // Use a unique storage key to prevent conflicts
      storageKey: uniqueKey,
    },
  })
}
