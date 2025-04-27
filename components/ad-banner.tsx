"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getActiveAds } from "@/lib/db/ads"

export function AdBanner() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const activeAds = await getActiveAds(5) // Get up to 5 active ads
        setAds(activeAds)
        setImageError(false)
      } catch (error) {
        console.error("Error fetching ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()

    // Rotate ads every 10 seconds if there are multiple ads
    const interval = setInterval(() => {
      if (ads.length > 1) {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length)
        setImageError(false)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [ads.length])

  if (loading) {
    return (
      <div className="w-full bg-slate-800 text-white p-4 flex justify-between items-center animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        <div className="h-8 bg-slate-700 rounded w-24"></div>
      </div>
    )
  }

  // If no ads are available, don't render anything
  if (ads.length === 0) {
    return null
  }

  const currentAd = ads[currentAdIndex]

  return (
    <div className="w-full bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {currentAd.image_url && !imageError ? (
          <div className="relative h-12 w-40 flex-shrink-0">
            <Image
              src={currentAd.image_url || "/placeholder.svg"}
              alt={currentAd.title}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <span className="text-lg font-medium">{currentAd.title}</span>
        )}
      </div>
      <Link
        href={currentAd.url}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-white px-4 py-1 rounded hover:bg-white hover:text-slate-800 transition-colors"
      >
        Learn More
      </Link>
    </div>
  )
}
