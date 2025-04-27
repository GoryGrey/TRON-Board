"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the ToastContainer with ssr: false
const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer), { ssr: false })

export function ClientProviders() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <ToastContainer />
}
