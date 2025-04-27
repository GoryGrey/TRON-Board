import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a single instance of the Supabase client
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
  }

  console.log("Initializing Supabase client")
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "x-application-name": "yi-bang",
      },
    },
  })

  return supabaseClient
}

// For server-side operations, we need a separate client
// This ensures we don't mix client and server auth contexts
let serverSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getServerSupabaseClient() {
  if (typeof window !== "undefined") {
    console.warn("getServerSupabaseClient should only be called on the server")
    return getSupabaseClient() // Fallback to regular client on client-side
  }

  if (serverSupabaseClient) {
    return serverSupabaseClient
  }

  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Server Supabase URL or Service Key is missing")
  }

  console.log("Initializing Server Supabase client")
  serverSupabaseClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "x-application-name": "yi-bang-server",
      },
    },
  })

  return serverSupabaseClient
}
