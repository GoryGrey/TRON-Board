"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function addToWaitlist(email: string, source = "general") {
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    }
  }

  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check if email already exists in waitlist
    const { data: existingEntry, error: checkError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error("Error checking waitlist:", checkError)
      return {
        success: false,
        message: "Failed to check waitlist. Please try again.",
      }
    }

    if (existingEntry) {
      return {
        success: true,
        message: "You're already on our waitlist! We'll notify you when Token Hub launches.",
      }
    }

    // Add email to waitlist
    const { error: insertError } = await supabase.from("waitlist").insert([
      {
        email,
        source,
        created_at: new Date().toISOString(),
      },
    ])

    if (insertError) {
      console.error("Error adding to waitlist:", insertError)
      return {
        success: false,
        message: "Failed to join waitlist. Please try again.",
      }
    }

    revalidatePath("/tokens")

    return {
      success: true,
      message: "Thanks for joining our waitlist! We'll notify you when Token Hub launches.",
    }
  } catch (error) {
    console.error("Waitlist submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
