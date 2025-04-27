import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TRON Board - Login",
  description: "Log in to your TRON Board account",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
