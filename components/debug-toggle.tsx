"use client"

import { useAuth } from "@/contexts/auth-context"
import { Bug } from "lucide-react"

export default function DebugToggle() {
  const { debugMode, toggleDebugMode, storageMode } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        <div className="bg-card/80 text-xs px-2 py-1 rounded-md">Storage: {storageMode}</div>
        <button
          onClick={toggleDebugMode}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
            debugMode
              ? "bg-red-500/20 text-red-500 border border-red-500/50"
              : "bg-card/80 text-muted-foreground hover:text-primary"
          }`}
        >
          <Bug className="h-4 w-4" />
          <span className="text-xs font-medium">{debugMode ? "Debug Mode ON" : "Debug Mode"}</span>
        </button>
      </div>
    </div>
  )
}
