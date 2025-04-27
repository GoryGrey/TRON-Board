import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { v4 as uuidv4 } from "uuid"

/**
 * Uploads a file to Supabase storage
 */
export async function uploadToStorage(
  file: File,
  bucket = "public",
  folder = "uploads",
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    generateThumbnail?: boolean
  } = {},
) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = getSupabaseAdmin()
    if (!supabase) throw new Error("Supabase admin client not initialized")

    // Generate a unique file name to prevent collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type === "image/gif" ? "image/gif" : file.type,
    })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      bucket,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Deletes a file from Supabase storage
 */
export async function deleteFromStorage(path: string, bucket = "public") {
  try {
    // Use admin client to bypass RLS policies
    const supabase = getSupabaseAdmin()
    if (!supabase) throw new Error("Supabase admin client not initialized")

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Lists files in a folder
 */
export async function listFiles(folder = "", bucket = "public") {
  try {
    // Use admin client to bypass RLS policies
    const supabase = getSupabaseAdmin()
    if (!supabase) throw new Error("Supabase admin client not initialized")

    const { data, error } = await supabase.storage.from(bucket).list(folder)

    if (error) throw error

    return {
      success: true,
      files: data,
    }
  } catch (error) {
    console.error("Error listing files:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      files: [],
    }
  }
}

/**
 * Gets a temporary URL for a file (useful for private buckets)
 */
export async function getTemporaryUrl(path: string, bucket = "public", expiresIn = 60) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = getSupabaseAdmin()
    if (!supabase) throw new Error("Supabase admin client not initialized")

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

    if (error) throw error

    return {
      success: true,
      url: data.signedUrl,
    }
  } catch (error) {
    console.error("Error getting temporary URL:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
