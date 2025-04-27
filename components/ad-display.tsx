"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getActiveAds } from "@/lib/db/ads"
import { Card, CardContent } from "@/components/ui/card"

interface Ad {
  id: string
  title: string
  description: string
  url: string
  image_url?: string
  is_active: boolean
}

export function AdDisplay({ limit = 1, className = "" }: { limit?: number; className?: string }) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        const activeAds = await getActiveAds(limit)
        console.log("Fetched ads:", activeAds) // Add logging to debug
        setAds(activeAds)
        setImageErrors({})
      } catch (error) {
        console.error("Error fetching ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()

    // Add a refresh interval to check for new ads every minute
    const intervalId = setInterval(fetchAds, 60000)

    return () => clearInterval(intervalId)
  }, [limit])

  const handleImageError = (adId: string) => {
    console.error(`Image failed to load for ad ${adId}`)
    setImageErrors((prev) => ({
      ...prev,
      [adId]: true,
    }))
  }

  if (loading) {
    return (
      <Card className={`w-full h-[150px] animate-pulse ${className}`}>
        <CardContent className="p-0">
          <div className="w-full h-[150px] bg-muted"></div>
        </CardContent>
      </Card>
    )
  }

  if (ads.length === 0) {
    return null
  }

  return (
    <>
      {ads.map((ad) => (
        <Link href={ad.url} key={ad.id} target="_blank" rel="noopener noreferrer">
          <Card className={`w-full overflow-hidden hover:shadow-md transition-shadow ${className}`}>
            <CardContent className="p-0">
              {ad.image_url && !imageErrors[ad.id] ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={ad.image_url || "/placeholder.svg"}
                    alt={ad.title}
                    fill
                    className="object-contain"
                    onError={() => handleImageError(ad.id)}
                    unoptimized // Add this to bypass image optimization which might be causing issues
                  />
                </div>
              ) : (
                <div className="w-full h-[80px] bg-muted flex items-center justify-center">
                  <span className="text-lg font-medium">{ad.title}</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="font-medium text-sm">{ad.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
                <div className="text-[10px] text-muted-foreground mt-1">Sponsored</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  )
}
