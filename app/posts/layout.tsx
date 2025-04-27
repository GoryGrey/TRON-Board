import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TRON Board - Posts",
  description: "View and engage with posts on TRON Board",
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
