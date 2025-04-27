"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import AsciiArt from "@/components/ascii-art"
import PrestigeRanks from "@/components/prestige-ranks"
import PrestigeActions from "@/components/prestige-actions"
import { useAuth } from "@/contexts/auth-context"
import PrestigeBadge from "@/components/prestige-badge"
import { formatPrestigeScore, generateReputationBar } from "@/lib/reputation"

export default function PrestigePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <SystemBanner message="威望值系统 - 提升您的声望" />

      <AdSlot type="banner" />

      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>

      <AsciiArt type="header" text="威望值 PRESTIGE SYSTEM" />

      <div className="forum-card animate-fade-in">
        <h1 className="text-2xl font-medium mb-4 pixel-text">
          威望值 Prestige System
          <span className="chinese-caption block">声望系统</span>
        </h1>

        <p className="text-muted-foreground mb-6">
          The 威望值 (Prestige Value) system is a social reputation system inspired by Chinese cultivation lore. It
          rewards positive contributions to the community and assigns ranks based on your accumulated prestige.
        </p>

        {user && user.prestigeScore !== undefined && (
          <div className="bg-card/50 border border-border p-4 rounded-sm mb-6">
            <h2 className="text-lg font-medium mb-2">Your Prestige Status</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="text-center md:text-left">
                <PrestigeBadge score={user.prestigeScore} isAdmin={user.isAdmin} size="lg" showTooltip={false} />
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">威望值 Score:</span>{" "}
                  <span className="text-lg font-bold">{formatPrestigeScore(user.prestigeScore)}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Prestige Bar:</div>
                <div className="text-xl font-mono tracking-wider text-primary">
                  {generateReputationBar(user.prestigeScore)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrestigeRanks />
          <PrestigeActions />
        </div>
      </div>

      <AdSlot type="banner" />
    </div>
  )
}
