"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trophy } from "lucide-react"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import AsciiArt from "@/components/ascii-art"
import PrestigeBadge from "@/components/prestige-badge"
import { formatPrestigeScore, generateReputationBar } from "@/lib/reputation"

// Mock data
import { users } from "@/lib/mock-data"

// Add the admin user to the mock data
const adminUser = {
  id: "user_admin_gorygrey",
  name: "GoryGrey",
  avatar: "/placeholder.svg?height=96&width=96",
  bio: "Yī Bāng Court Official and Administrator",
  joinedAt: new Date("2023-01-01"),
  reputation: 1500,
  level: 10,
  badges: ["Admin", "Court Official"],
  postCount: 120,
  commentCount: 350,
  prestigeScore: 9999,
  isAdmin: true,
  role: "admin",
}

// Combine mock users with admin user
const allUsers = [adminUser, ...users]

export default function LeaderboardPage() {
  // Sort users by prestige score
  const sortedUsers = [...allUsers].sort((a, b) => {
    const scoreA = a.prestigeScore || 0
    const scoreB = b.prestigeScore || 0
    return scoreB - scoreA
  })

  return (
    <div className="space-y-6">
      <SystemBanner message="威望值排行榜 - 查看最有声望的用户" />

      <AdSlot type="banner" />

      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>

      <AsciiArt type="header" text="PRESTIGE LEADERBOARD" />

      <div className="forum-card animate-fade-in">
        <h1 className="text-2xl font-medium mb-4 pixel-text">
          威望值 Leaderboard
          <span className="chinese-caption block">声望排行榜</span>
        </h1>

        <p className="text-muted-foreground mb-6">
          The most prestigious members of the Yī Bāng community, ranked by their 威望值 (Prestige Value).
        </p>

        <div className="space-y-4">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="bg-card/50 border border-border p-4 rounded-sm flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                {index === 0 ? (
                  <Trophy className="h-5 w-5 text-amber-500" />
                ) : index === 1 ? (
                  <Trophy className="h-5 w-5 text-gray-400" />
                ) : index === 2 ? (
                  <Trophy className="h-5 w-5 text-amber-700" />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                )}
              </div>

              <div className="flex-shrink-0">
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="avatar-forum"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                  <Link href={`/profile/${user.id}`} className="text-lg font-medium hover:text-primary">
                    {user.name}
                  </Link>
                  <PrestigeBadge score={user.prestigeScore || 0} isAdmin={user.isAdmin} size="sm" />
                </div>

                <div className="mt-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <div className="text-sm text-muted-foreground">
                    威望值: <span className="font-medium">{formatPrestigeScore(user.prestigeScore || 0)}</span>
                  </div>
                  <div className="text-sm font-mono tracking-wider text-primary">
                    {generateReputationBar(user.prestigeScore || 0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdSlot type="banner" />
    </div>
  )
}
