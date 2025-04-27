"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DebugPanel() {
  const { debugMode, toggleDebugMode, storageMode, user, forceLogin } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [forceEmail, setForceEmail] = useState("debug@example.com")
  const [forceUsername, setForceUsername] = useState("DebugUser")

  if (!debugMode) return null

  const handleForceLogin = () => {
    forceLogin(forceEmail, forceUsername)
  }

  const getLocalStorageItems = () => {
    try {
      return Object.keys(localStorage).map((key) => ({
        key,
        value: localStorage.getItem(key),
      }))
    } catch (e) {
      console.error("Error accessing localStorage:", e)
      return []
    }
  }

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-md shadow-lg p-3 max-w-md">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-primary">Debug Panel</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? "Hide" : "Show"}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 text-xs font-mono max-h-96 overflow-auto">
            <div className="mb-3 pb-2 border-b border-border">
              <div className="flex justify-between">
                <p>
                  Storage Mode: <span className="text-primary">{storageMode}</span>
                </p>
                <p>
                  Debug Mode: <span className="text-primary">Enabled</span>
                </p>
              </div>
            </div>

            <div className="mb-3 pb-2 border-b border-border">
              <p className="font-semibold mb-1">Auth Status:</p>
              <div className="pl-2">
                <p>
                  Status: <span className="text-primary">{user ? "Logged In" : "Not Logged In"}</span>
                </p>
                {user && (
                  <>
                    <p>
                      User ID: <span className="text-primary">{user.id}</span>
                    </p>
                    <p>
                      Email: <span className="text-primary">{user.email}</span>
                    </p>
                    <p>
                      Username: <span className="text-primary">{user.username}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mb-3 pb-2 border-b border-border">
              <p className="font-semibold mb-1">Force Login:</p>
              <div className="space-y-2 mt-2">
                <Input
                  placeholder="Email"
                  value={forceEmail}
                  onChange={(e) => setForceEmail(e.target.value)}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="Username"
                  value={forceUsername}
                  onChange={(e) => setForceUsername(e.target.value)}
                  className="h-7 text-xs"
                />
                <Button onClick={handleForceLogin} className="w-full h-7 text-xs">
                  Force Login
                </Button>
              </div>
            </div>

            <div className="mb-3">
              <p className="font-semibold mb-1">LocalStorage:</p>
              <div className="pl-2 mt-1 space-y-1">
                {getLocalStorageItems().map(({ key, value }) => (
                  <div key={key} className="border-b border-border/30 pb-1">
                    <p className="font-medium">{key}:</p>
                    <pre className="text-primary text-[10px] whitespace-pre-wrap break-all mt-1">{value}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mt-3">
              <Button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                variant="destructive"
                className="text-xs h-7 flex-1"
              >
                Clear LocalStorage & Reload
              </Button>

              <Button
                onClick={() => {
                  // Initialize users array
                  localStorage.setItem(
                    "users",
                    JSON.stringify([
                      {
                        id: "user_test123",
                        email: "test@example.com",
                        username: "TestUser",
                        password: "password",
                      },
                    ]),
                  )
                  window.location.reload()
                }}
                variant="outline"
                className="text-xs h-7 flex-1"
              >
                Reset Users Array
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
