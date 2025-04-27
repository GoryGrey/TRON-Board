import { createClient } from "@/lib/supabase/server"

export async function uploadImage(file: File, folder = "uploads") {
  try {
    console.log(`Starting upload for file: ${file.name} to folder: ${folder}`)
    const supabase = createClient()

    // Get file extension
    const fileExt = file.name.split(".").pop()

    // Create a unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    // Full path including folder
    const filePath = `${folder}/${fileName}`

    console.log(`Uploading file to: ${filePath}`)

    // Try to upload to the public bucket first
    const { data, error } = await supabase.storage.from("public").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // Change to true to overwrite if file exists
      contentType: file.type, // Set the correct content type
    })

    if (error) {
      console.error("Error uploading to public bucket:", error)

      // If the public bucket doesn't exist, try to find available buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError)
        throw bucketsError
      }

      if (!buckets || buckets.length === 0) {
        throw new Error("No storage buckets available")
      }

      // Try the first available bucket
      const bucket = buckets[0].name
      console.log(`Trying alternative bucket: ${bucket}`)

      const { data: altData, error: altError } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Change to true to overwrite if file exists
        contentType: file.type,
      })

      if (altError) {
        console.error(`Error uploading to ${bucket} bucket:`, altError)
        throw altError
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
      console.log("Upload successful to alternative bucket, URL:", publicUrlData.publicUrl)

      return {
        path: filePath,
        bucket: bucket,
        publicUrl: publicUrlData.publicUrl,
      }
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("public").getPublicUrl(filePath)
    console.log("Upload successful to public bucket, URL:", publicUrlData.publicUrl)

    return {
      path: filePath,
      bucket: "public",
      publicUrl: publicUrlData.publicUrl,
    }
  } catch (error) {
    console.error("Error in uploadImage:", error)
    throw error
  }
}
