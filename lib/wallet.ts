// TronLink wallet utility functions
import { toast } from "@/hooks/use-toast"

export type WalletState = {
  installed: boolean
  connected: boolean
  address: string | null
  balance: string | null
  network: string | null
}

export const initialWalletState: WalletState = {
  installed: false,
  connected: false,
  address: null,
  balance: null,
  network: null,
}

// Check if TronLink is installed
export const isTronLinkInstalled = (): boolean => {
  return typeof window !== "undefined" && !!window.tronWeb
}

// Request connection to TronLink wallet
export const connectWallet = async (): Promise<WalletState> => {
  try {
    if (!isTronLinkInstalled()) {
      toast({
        title: "TronLink Not Found",
        description: "Please install TronLink wallet extension",
        variant: "destructive",
      })
      return { ...initialWalletState, installed: false }
    }

    // Request account access
    const tronWeb = window.tronWeb

    if (!tronWeb) {
      toast({
        title: "TronLink Error",
        description: "Unable to connect to TronLink",
        variant: "destructive",
      })
      return { ...initialWalletState, installed: true }
    }

    // Check if already logged in
    if (tronWeb.defaultAddress.base58) {
      const address = tronWeb.defaultAddress.base58
      const balance = await tronWeb.trx.getBalance(address)
      const formattedBalance = (balance / 1000000).toFixed(2) // Convert SUN to TRX
      const network = tronWeb.fullNode.host.includes("shasta") ? "Shasta Testnet" : "MainNet"

      return {
        installed: true,
        connected: true,
        address,
        balance: formattedBalance,
        network,
      }
    }

    // Request account access if not already connected
    try {
      await tronWeb.request({ method: "tron_requestAccounts" })

      // Wait a moment for TronLink to update
      await new Promise((resolve) => setTimeout(resolve, 500))

      const address = tronWeb.defaultAddress.base58
      const balance = await tronWeb.trx.getBalance(address)
      const formattedBalance = (balance / 1000000).toFixed(2) // Convert SUN to TRX
      const network = tronWeb.fullNode.host.includes("shasta") ? "Shasta Testnet" : "MainNet"

      return {
        installed: true,
        connected: true,
        address,
        balance: formattedBalance,
        network,
      }
    } catch (error) {
      console.error("Error connecting to TronLink:", error)
      toast({
        title: "Connection Rejected",
        description: "You rejected the connection request",
        variant: "destructive",
      })
      return { ...initialWalletState, installed: true }
    }
  } catch (error) {
    console.error("Error connecting to TronLink:", error)
    toast({
      title: "Connection Error",
      description: "Failed to connect to TronLink",
      variant: "destructive",
    })
    return initialWalletState
  }
}

// Disconnect wallet (for UI purposes only, doesn't actually disconnect TronLink)
export const disconnectWallet = (): WalletState => {
  return initialWalletState
}

// Get shortened address for display
export const shortenAddress = (address: string | null): string => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
