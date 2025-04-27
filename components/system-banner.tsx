import { Bell } from "lucide-react"

export default function SystemBanner({ message }: { message: string }) {
  // Only show the banner with the bell emoji, not the system announcement
  if (message.includes("系统公告") || message.includes("TRON Board: 探索TRON生态和其他区块链的讨论版块")) {
    return null
  }

  return (
    <div className="w-full bg-amber-950/20 border border-amber-500/20 p-3 rounded-lg mb-4 flex items-center gap-2">
      <Bell className="h-4 w-4 text-amber-500" />
      <p className="text-sm text-amber-500">{message}</p>
    </div>
  )
}
