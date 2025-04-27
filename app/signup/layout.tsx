import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TRON Board - Sign Up",
  description: "Create a new TRON Board account",
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
