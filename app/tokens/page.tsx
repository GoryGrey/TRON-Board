"use client"

import { useState } from "react"
import { Search, Zap, TrendingUp, Clock, Construction } from "lucide-react"
import { Input } from "@/components/ui/input"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import AsciiArt from "@/components/ascii-art"
import { TokenWaitlistModal } from "@/components/token-waitlist-modal"

export default function TokensPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  return (
    <div className="space-y-6">
      <SystemBanner message="代币中心即将推出 - 敬请期待" />

      <AdSlot type="banner" />

      <AsciiArt type="header" text="TOKEN HUB - COMING SOON" />

      <div className="forum-card animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full">
            <Construction className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-medium mb-2 text-center pixel-text">
          Token Hub
          <span className="chinese-caption block">代币中心</span>
        </h1>

        <div className="text-center mb-8">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-md text-lg font-medium">
            Coming Soon
            <span className="chinese-caption block">即将推出</span>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
          We're working hard to bring you a comprehensive token hub where you can explore, track, and discover tokens in
          the crypto ecosystem. Stay tuned for updates!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 opacity-70">
          <div className="bg-card border border-dashed border-primary/40 flex items-center gap-2 justify-center py-6 cursor-not-allowed">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              Popular
              <span className="chinese-caption block">热门代币</span>
            </div>
          </div>
          <div className="bg-card border border-dashed border-primary/40 flex items-center gap-2 justify-center py-6 cursor-not-allowed">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              Trending
              <span className="chinese-caption block">趋势代币</span>
            </div>
          </div>
          <div className="bg-card border border-dashed border-primary/40 flex items-center gap-2 justify-center py-6 cursor-not-allowed">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              New Listings
              <span className="chinese-caption block">新上币</span>
            </div>
          </div>
        </div>

        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tokens..."
            disabled
            className="pl-10 bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="coming-soon-badge">🚧 Coming Soon</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Want to be notified when Token Hub launches?{" "}
            <a
              href="#"
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault()
                setIsWaitlistOpen(true)
              }}
            >
              Join our waitlist
            </a>
          </p>
        </div>
      </div>

      <AdSlot type="banner" />

      <TokenWaitlistModal open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </div>
  )
}
