"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import Image from "next/image"

interface AdSlotProps {
  type: "banner" | "sidebar" | "inline"
  className?: string
}

export default function AdSlot({ type, className = "" }: AdSlotProps) {
  const [ad, setAd] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setIsLoading(true)

        // Create a timeout to abort the fetch if it takes too long
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        console.log(`Fetching ad for ${type} slot`)

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) {
          console.error("Error fetching ad:", error)
          setError("Failed to load advertisement")
          return
        }

        if (data && data.length > 0) {
          console.log(`Ad found for ${type} slot:`, data[0])
          setAd(data[0])
        } else {
          console.log(`No ads found for ${type} slot`)
        }
      } catch (error) {
        console.error(`Error in AdSlot (${type}):`, error)
        setError("Failed to load advertisement")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAd()
  }, [type])

  // If there's an error or no ad, render an empty placeholder
  if (error || (!ad && !isLoading)) {
    return null // Don't show anything if there's an error or no ad
  }

  // Show loading placeholder
  if (isLoading) {
    return (
      <div
        className={`ad-slot ad-slot-${type} ${className} bg-muted/20 animate-pulse rounded-md`}
        style={{ height: type === "banner" ? "90px" : type === "sidebar" ? "250px" : "120px" }}
      ></div>
    )
  }

  // Render the actual ad
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`ad-slot ad-slot-${type} ${className} block overflow-hidden rounded-md border transition-all hover:border-primary`}
    >
      {ad.image_url ? (
        <div
          className="relative w-full"
          style={{ height: type === "banner" ? "90px" : type === "sidebar" ? "250px" : "120px" }}
        >
          <Image
            src={ad.image_url || "/placeholder.svg"}
            alt={ad.title || "Advertisement"}
            fill
            className="object-cover"
            onError={() => console.error("Error loading ad image:", ad.image_url)}
          />
        </div>
      ) : (
        <div
          className={`bg-muted/20 p-4 text-center`}
          style={{ height: type === "banner" ? "90px" : type === "sidebar" ? "250px" : "120px" }}
        >
          <p className="font-medium">{ad.title}</p>
          {ad.description && <p className="text-sm text-muted-foreground">{ad.description}</p>}
        </div>
      )}
    </a>
  )
}
