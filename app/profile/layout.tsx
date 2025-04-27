import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TRON Board - Profile",
  description: "Manage your TRON Board profile",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
