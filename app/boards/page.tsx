"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import BoardCard from "@/components/board-card"
import { Zap, Landmark } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"

export default function BoardsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [boards, setBoards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use the actual UUIDs from the database
  const tronGeneralId = "3a2896bc-f29d-46c9-ac22-02173d420659"
  const tronDefiId = "d994429b-a7b3-468e-bbb6-adb671c498eb"

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true)

        // Create a timeout to abort the fetch if it takes too long
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        console.log("Fetching boards")

        const { data, error } = await supabase.from("boards").select("*").abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) {
          console.error("Error fetching boards:", error)
          setError("Failed to load boards")
          return
        }

        console.log("Boards fetched:", data)
        setBoards(data || [])
      } catch (error) {
        console.error("Error in fetchBoards:", error)
        setError("Failed to load boards")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoards()
  }, [])

  const filteredBoards = boards.filter(
    (board) =>
      board.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (error) {
    return (
      <div className="space-y-6">
        <SystemBanner message="Error loading boards. Please try again later." />
        <div className="forum-card">
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load boards. Please refresh the page or try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SystemBanner message="正在加载版块..." />
        <div className="forum-card animate-pulse">
          <div className="h-8 bg-muted/50 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted/50 rounded w-full mb-2"></div>
          <div className="h-4 bg-muted/50 rounded w-2/3 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted/30 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SystemBanner message="探索TRON生态和其他区块链的讨论版块" />

      {/* Wrap AdSlot in an ErrorBoundary or try-catch */}
      <div className="ad-container">
        <AdSlot type="banner" />
      </div>

      <div className="forum-card animate-fade-in">
        <h1 className="text-2xl font-medium mb-4 pixel-text">
          Boards
          <span className="chinese-caption block">版块</span>
        </h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 pixel-text">
            <span className="text-tron">TRON</span> Ecosystem Boards
            <span className="chinese-caption block">波场生态版块 (Our Primary Focus)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href={`/boards/${tronGeneralId}`} className="forum-card tron-highlight red-splash">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tron/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-tron" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg pixel-text">
                    TRON General
                    <span className="chinese-caption block">波场综合</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    General discussion about TRON blockchain, technology, and ecosystem.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground pixel-text">Posts</div>
                  <div className="text-lg font-medium pixel-text glow-text text-tron">1243</div>
                </div>
              </div>
            </Link>
            <Link href={`/boards/${tronDefiId}`} className="forum-card tron-highlight red-splash">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tron/10 flex items-center justify-center">
                  <Landmark className="h-6 w-6 text-tron" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg pixel-text">
                    TRON DeFi
                    <span className="chinese-caption block">波场金融</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    Discuss TRON-based DeFi protocols, yield farming, and liquidity mining.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground pixel-text">Posts</div>
                  <div className="text-lg font-medium pixel-text glow-text text-tron">856</div>
                </div>
              </div>
            </Link>
          </div>

          <h2 className="text-lg font-medium mb-3 pixel-text">
            Other Blockchain Boards
            <span className="chinese-caption block">其他区块链版块</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBoards.slice(0, 4).map((board) => (
            <BoardCard key={board.id} {...board} />
          ))}

          {/* Ad in the middle of boards - wrap in error boundary */}
          {filteredBoards.length > 4 && (
            <div className="md:col-span-2">
              <AdSlot type="inline" />
            </div>
          )}

          {filteredBoards.slice(4).map((board) => (
            <BoardCard key={board.id} {...board} />
          ))}
        </div>
      </div>

      {/* Wrap AdSlot in an ErrorBoundary or try-catch */}
      <div className="ad-container">
        <AdSlot type="banner" />
      </div>
    </div>
  )
}
