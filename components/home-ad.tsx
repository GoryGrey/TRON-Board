"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getActiveAds } from "@/lib/db/ads"

export function HomeAd() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const activeAds = await getActiveAds(5) // Get up to 5 active ads
        setAds(activeAds)
      } catch (error) {
        console.error("Error fetching home ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()

    // Rotate ads every 12 seconds if there are multiple ads
    const interval = setInterval(() => {
      if (ads.length > 1) {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length)
      }
    }, 12000)

    return () => clearInterval(interval)
  }, [ads.length])

  if (loading) {
    return (
      <div className="w-full bg-slate-800 text-white p-6 rounded-lg animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3 mb-6"></div>
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
    <div className="w-full bg-slate-800 text-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-2">{currentAd.title}</h3>
      <p className="mb-4">{currentAd.description}</p>
      <Link
        href={currentAd.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-white px-4 py-2 rounded hover:bg-white hover:text-slate-800 transition-colors"
      >
        Learn More
      </Link>
    </div>
  )
}
