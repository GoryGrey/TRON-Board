import { createClient } from "@/lib/supabase/server"

export async function getAllAds() {
  try {
    const supabase = createClient()

    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false })
      .abortSignal(controller.signal)

    clearTimeout(timeoutId)

    if (error) {
      console.error("Error fetching ads:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllAds:", error)
    // Return empty array instead of throwing to prevent page blocking
    return []
  }
}

// Make sure we're properly fetching active ads with timeout and error handling
export async function getActiveAds(limit = 1) {
  try {
    console.log("Fetching active ads, limit:", limit)
    const supabase = createClient()

    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit)
      .abortSignal(controller.signal)

    clearTimeout(timeoutId)

    if (error) {
      console.error("Error fetching active ads:", error)
      return []
    }

    console.log("Active ads fetched:", data)
    return data || []
  } catch (error) {
    console.error("Error in getActiveAds:", error)
    // Return empty array instead of throwing to prevent page blocking
    return []
  }
}

// Improve the createAd function to handle timeouts and errors better
export async function createAd({ title, description, url, imageUrl }) {
  console.log("createAd: Starting with params:", {
    title,
    description,
    url,
    imageUrl: imageUrl ? "provided" : "not provided",
  })

  // Create a controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.log("createAd: Database operation timed out after 15 seconds")
    controller.abort()
  }, 15000)

  try {
    console.log("createAd: Creating Supabase client")
    const supabase = createClient()

    console.log("createAd: About to insert ad into database")
    const startTime = Date.now()

    try {
      const { data, error } = await supabase
        .from("ads")
        .insert({
          title,
          description: description || "",
          url,
          image_url: imageUrl || null,
          is_active: true,
        })
        .abortSignal(controller.signal)
        .select()

      const duration = Date.now() - startTime
      console.log(`createAd: Database operation completed in ${duration}ms`)

      if (error) {
        console.error("createAd: Error inserting ad:", error)
        throw error
      }

      console.log("createAd: Ad created successfully:", data)
      return data[0]
    } catch (dbError) {
      if (dbError.name === "AbortError") {
        console.error("createAd: Operation timed out")
        throw new Error("Database operation timed out")
      }
      console.error("createAd: Database operation error:", dbError)
      throw dbError
    }
  } catch (error) {
    console.error("createAd: Error:", error)
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

// Keep the original updateAd function to maintain compatibility
export async function updateAd(id, { title, description, url, imageUrl, isActive }) {
  try {
    const supabase = createClient()
    const updates = {
      ...(title !== undefined && { title: title.slice(0, 255) }),
      ...(description !== undefined && { description: description.slice(0, 255) }),
      ...(url !== undefined && { url: url.slice(0, 255) }),
      ...(imageUrl !== undefined && { image_url: imageUrl.slice(0, 255) }),
      ...(isActive !== undefined && { is_active: isActive }),
      updated_at: new Date(),
    }

    const { data, error } = await supabase.from("ads").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating ad:", error)
    throw `Error updating ad: ${error.message || error}`
  }
}

// Add the new updateAdStatus function as well for future use
export async function updateAdStatus(id, isActive) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("ads").update({ is_active: isActive }).eq("id", id).select().single()

    if (error) {
      console.error("Error updating ad status:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data }
  } catch (error) {
    console.error("Error in updateAdStatus:", error)
    return { success: false, error: "Failed to update ad status", data: null }
  }
}

export async function deleteAd(id) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("ads").delete().eq("id", id)

    if (error) {
      console.error("Error deleting ad:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteAd:", error)
    return { success: false, error: "Failed to delete ad" }
  }
}
