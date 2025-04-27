import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Function with the name that our code is expecting
export const createClient = () => {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}

// Also export with the more descriptive name for future use
export const createServerClient = createClient
