"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getActiveAds } from "@/lib/db/ads"

export function BoardsAd() {
  const [ad, setAd] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true)
        const ads = await getActiveAds(1)
        if (ads && ads.length > 0) {
          setAd(ads[0])
        }
      } catch (error) {
        console.error("Error fetching ad for boards page:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAd()
  }, [])

  if (loading) {
    return (
      <div className="w-full bg-slate-800 text-white p-6 rounded-lg animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
    )
  }

  if (!ad) {
    return null
  }

  return (
    <div className="w-full bg-slate-800 text-white p-6 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold">{ad.title}</h3>
        <p className="text-gray-300">{ad.description}</p>
      </div>
      <Link
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-white px-4 py-2 rounded hover:bg-white hover:text-slate-800 transition-colors"
      >
        Learn More
      </Link>
    </div>
  )
}
