"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/boards")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Yī Bāng...</h1>
        <p className="text-muted-foreground">Redirecting to boards...</p>
      </div>
    </div>
  )
}
