"use client"

import type React from "react"

import { Inter, Space_Mono, VT323 } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import DebugToggle from "@/components/debug-toggle"
import DebugPanel from "@/components/debug-panel"
import dynamic from "next/dynamic"

// Import ScanlineEffect with no SSR
const ScanlineEffect = dynamic(() => import("@/components/scanline-effect"), {
  ssr: false,
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceMono.variable} ${vt323.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
              <Footer />
              <DebugToggle />
              <DebugPanel />
            </div>
            <ScanlineEffect intensity="light" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
