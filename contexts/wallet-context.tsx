"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type WalletState,
  initialWalletState,
  connectWallet,
  disconnectWallet,
  isTronLinkInstalled,
} from "@/lib/wallet"

interface WalletContextType {
  wallet: WalletState
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

const WalletContext = createContext<WalletContextType>({
  wallet: initialWalletState,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if TronLink is installed on mount
  useEffect(() => {
    const checkWallet = async () => {
      const installed = isTronLinkInstalled()
      setWallet((prev) => ({ ...prev, installed }))

      // If TronLink is installed, check if already connected
      if (installed && window.tronWeb && window.tronWeb.defaultAddress.base58) {
        try {
          const result = await connectWallet()
          setWallet(result)
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkWallet()

    // Listen for account changes
    const handleAccountsChanged = () => {
      checkWallet()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("message", (e) => {
        if (e.data.message && e.data.message.action === "accountsChanged") {
          handleAccountsChanged()
        }
      })
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleAccountsChanged)
      }
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)
    try {
      const result = await connectWallet()
      setWallet(result)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setWallet(disconnectWallet())
  }

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, isConnecting }}>{children}</WalletContext.Provider>
  )
}
