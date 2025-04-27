import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a server-side Supabase client with the service role key
// This bypasses RLS policies and should only be used in server-side code
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Server Supabase URL or Service Key is missing")
    throw new Error("Missing Supabase credentials for server client")
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "x-application-name": "yi-bang-server",
      },
    },
  })

  return supabase
}

// For compatibility with existing code that might use this pattern
export { createServerClient as createServerSupabaseClient }
