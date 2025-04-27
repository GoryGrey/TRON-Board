import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Store the client instance
let supabaseClient = null

export function createClient() {
  // If a client already exists, return it
  if (supabaseClient) {
    return supabaseClient
  }

  // Otherwise, create a new client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}
