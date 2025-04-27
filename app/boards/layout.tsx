import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TRON Board - Boards",
  description: "Browse and participate in discussions on TRON Board",
}

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
