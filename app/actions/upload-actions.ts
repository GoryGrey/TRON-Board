"use server"

import { uploadToStorage, deleteFromStorage } from "@/lib/storage-service"
import { getSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

/**
 * Uploads a file to Supabase storage
 */
export async function uploadFile(file: File, folder = "uploads") {
  try {
    const result = await uploadToStorage(file, "public", folder)

    if (!result.success) {
      throw new Error(result.error || "Failed to upload file")
    }

    return {
      success: true,
      url: result.url,
      path: result.path,
    }
  } catch (error) {
    console.error("Error in uploadFile action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Deletes a file from Supabase storage
 */
export async function deleteFile(path: string) {
  try {
    const result = await deleteFromStorage(path)

    if (!result.success) {
      throw new Error(result.error || "Failed to delete file")
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error in deleteFile action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Updates a post's image
 */
export async function updatePostImage(postId: string, imageUrl: string | null) {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("posts").update({ image_url: imageUrl }).eq("id", postId)

    if (error) throw error

    // Revalidate the post page
    revalidatePath(`/posts/${postId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating post image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
