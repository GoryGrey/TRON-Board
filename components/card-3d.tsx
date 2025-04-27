"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Card3DProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glare?: boolean
}

export default function Card3D({ children, className, intensity = 15, glare = true }: Card3DProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)

    // Check if we're in a mobile context where 3D effects might cause issues
    const checkMobile = () => {
      try {
        const isMobile = window.matchMedia("(max-width: 768px)").matches
        setIsEnabled(!isMobile)
      } catch (error) {
        console.error("Error checking media query:", error)
        setIsEnabled(false)
      }
    }

    checkMobile()

    // Add listener for window resize
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Find the handleMouseMove function and modify it to reduce the intensity
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !isMounted || !cardRef.current) return

    try {
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX
      const mouseY = e.clientY

      // Calculate rotation based on mouse position relative to card center
      // Reduce intensity to minimize blur
      const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * (intensity * 0.5)
      const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * (intensity * 0.5)

      setRotateX(rotateXValue)
      setRotateY(rotateYValue)

      // Calculate glare position
      const glareX = ((mouseX - rect.left) / rect.width) * 100
      const glareY = ((mouseY - rect.top) / rect.height) * 100
      setGlarePosition({ x: glareX, y: glareY })
    } catch (error) {
      console.error("Error in Card3D handleMouseMove:", error)
      // Reset to default values on error
      setRotateX(0)
      setRotateY(0)
      setGlarePosition({ x: 50, y: 50 })
      setIsEnabled(false) // Disable effects on error
    }
  }

  const handleMouseLeave = () => {
    if (!isEnabled) return
    setRotateX(0)
    setRotateY(0)
  }

  // If not mounted yet or effects are disabled, just render children without 3D effect
  if (!isMounted || !isEnabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden transition-transform duration-200", className)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
      <div className="relative z-0">{children}</div>
    </div>
  )
}
