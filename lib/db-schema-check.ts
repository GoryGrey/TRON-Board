"use server"

import { getSupabaseClient } from "@/lib/supabase"

export async function checkAndUpdatePostsSchema() {
  const supabase = getSupabaseClient()

  try {
    // Check if the posts table exists
    const { data: tableExists, error: tableError } = await supabase.from("posts").select("id").limit(1)

    if (tableError) {
      console.error("Error checking posts table:", tableError)
      return { success: false, error: tableError.message }
    }

    // Check if we need to add the image_url column
    const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", { table_name: "posts" })

    if (columnsError) {
      console.error("Error checking posts columns:", columnsError)
      return { success: false, error: columnsError.message }
    }

    const hasImageUrl = columns.some((col: any) => col.column_name === "image_url")

    if (!hasImageUrl) {
      // Add the image_url column
      const { error: alterError } = await supabase.rpc("add_column_if_not_exists", {
        table_name: "posts",
        column_name: "image_url",
        column_type: "TEXT",
      })

      if (alterError) {
        console.error("Error adding image_url column:", alterError)
        return { success: false, error: alterError.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in checkAndUpdatePostsSchema:", error)
    return { success: false, error: String(error) }
  }
}
