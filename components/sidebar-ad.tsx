"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getActiveAds } from "@/lib/db/ads"

export function SidebarAd() {
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
        console.error("Error fetching sidebar ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()

    // Rotate ads every 15 seconds if there are multiple ads
    const interval = setInterval(() => {
      if (ads.length > 1) {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length)
        setImageError(false)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [ads.length])

  if (loading) {
    return (
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-4 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    )
  }

  // If no ads are available, don't render anything
  if (ads.length === 0) {
    return null
  }

  const currentAd = ads[currentAdIndex]

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
      <Link href={currentAd.url} target="_blank" rel="noopener noreferrer" className="block">
        {currentAd.image_url && !imageError ? (
          <div className="relative h-32 w-full mb-2">
            <Image
              src={currentAd.image_url || "/placeholder.svg"}
              alt={currentAd.title}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="h-32 w-full bg-muted flex items-center justify-center mb-2">
            <span className="text-lg font-medium">{currentAd.title}</span>
          </div>
        )}
        <h3 className="font-medium mb-1">{currentAd.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{currentAd.description}</p>
      </Link>
    </div>
  )
}
