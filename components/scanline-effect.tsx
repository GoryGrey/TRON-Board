"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ScanlineEffectProps {
  className?: string
  intensity?: "light" | "medium" | "heavy"
}

export default function ScanlineEffect({ className, intensity = "light" }: ScanlineEffectProps) {
  const [mounted, setMounted] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    try {
      // Only set mounted to true on client-side
      setMounted(true)

      // Check if we're in a mobile context where effects might cause performance issues
      const isMobile = window.matchMedia("(max-width: 768px)").matches
      setIsEnabled(!isMobile)
    } catch (error) {
      console.error("Error in ScanlineEffect:", error)
      setIsEnabled(false)
    }

    return () => {
      // Cleanup function
      setMounted(false)
    }
  }, [])

  // Don't render anything on server-side or if disabled
  if (!mounted || !isEnabled) return null

  const getOpacity = () => {
    switch (intensity) {
      case "light":
        return "0.03"
      case "medium":
        return "0.05"
      case "heavy":
        return "0.08"
      default:
        return "0.03"
    }
  }

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-[100] overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, ${getOpacity()}) 50%
          )`,
          backgroundSize: "100% 4px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle at center,
            transparent 30%,
            rgba(0, 0, 0, 0.15) 100%
          )`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  )
}
