"use client"

import { useState } from "react"
import { Wallet, LogOut, ExternalLink, Copy, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWallet } from "@/contexts/wallet-context"
import { shortenAddress } from "@/lib/wallet"
import { useToast } from "@/hooks/use-toast"
import Card3D from "@/components/card-3d"

export default function WalletConnect() {
  const { wallet, connect, disconnect, isConnecting } = useWallet()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    await connect()
    if (wallet.connected) {
      setIsOpen(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
  }

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openTronScan = () => {
    if (wallet.address) {
      const baseUrl =
        wallet.network === "Shasta Testnet"
          ? "https://shasta.tronscan.org/#/address/"
          : "https://tronscan.org/#/address/"
      window.open(`${baseUrl}${wallet.address}`, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {wallet.connected ? (
          <button className="tron-button red-splash">
            <Wallet className="h-4 w-4 mr-2 inline-block" />
            {shortenAddress(wallet.address)}
            <span className="chinese-caption block">已连接钱包</span>
          </button>
        ) : (
          <button className="tron-button red-splash">
            <Wallet className="h-4 w-4 mr-2 inline-block" />
            Connect TRON Wallet
            <span className="chinese-caption block">连接波场钱包</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pixel-text">
            {wallet.connected ? "Wallet Connected" : "Connect Wallet"}
            <span className="chinese-caption block">{wallet.connected ? "钱包已连接" : "连接钱包"}</span>
          </DialogTitle>
          <DialogDescription>
            {wallet.connected
              ? "Your TRON wallet is connected to TRON Board"
              : "Connect your TRON wallet to create an account and participate in TRON ecosystem discussions"}
          </DialogDescription>
        </DialogHeader>

        {wallet.connected ? (
          <div className="space-y-4 py-4">
            <Card3D>
              <div className="forum-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground pixel-text">Address</span>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 droplet-effect" onClick={copyAddress}>
                            {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 droplet-effect" onClick={openTronScan}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on TronScan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="text-sm font-mono bg-muted p-2 rounded-sm overflow-x-auto">{wallet.address}</div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground pixel-text">Balance</span>
                    <p className="text-lg font-medium">{wallet.balance} TRX</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground pixel-text">Network</span>
                    <p className="text-lg font-medium">{wallet.network}</p>
                  </div>
                </div>
              </div>
            </Card3D>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="bracket-button bg-destructive text-destructive-foreground hover:bg-destructive/90 liquid-splash"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {!wallet.installed && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-md">
                <p className="text-sm">
                  TronLink wallet extension is not installed. Please install TronLink to continue.
                </p>
                <a
                  href="https://www.tronlink.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center mt-2 text-amber-500 hover:text-amber-400"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Get TronLink Wallet
                </a>
              </div>
            )}

            <Card3D>
              <div className="forum-card p-4">
                <h3 className="text-lg font-medium mb-2 pixel-text">Why connect a wallet?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Create a unique identity on Yī Bāng
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Participate in discussions and earn reputation
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    No passwords to remember - just your wallet
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Full control over your account
                  </li>
                </ul>
              </div>
            </Card3D>

            <div className="flex justify-end">
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !wallet.installed}
                className="bracket-button bg-primary text-primary-foreground hover:bg-primary/90 multi-droplet"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect TronLink"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
