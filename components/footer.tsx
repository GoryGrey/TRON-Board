import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import AsciiArt from "@/components/ascii-art"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container mx-auto px-4">
        <AsciiArt type="divider" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3 pixel-text glow-text text-primary">
              TRON Board
              <span className="chinese-caption block">波场论坛</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              A TRON-first crypto message board welcoming discussions about all chains.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 pixel-text">
              Links
              <span className="chinese-caption block">链接</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 pixel-text"
                >
                  About
                  <span className="chinese-caption block">关于</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 pixel-text"
                >
                  Contact
                  <span className="chinese-caption block">联系</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 pixel-text"
                >
                  Legal
                  <span className="chinese-caption block">法律</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 pixel-text">
              Connect
              <span className="chinese-caption block">连接</span>
            </h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/GoryGrey/TRON-Board"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://x.com/tronboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dotted border-border/50 text-center text-xs text-muted-foreground pixel-text">
          <p>© {new Date().getFullYear()} TRON Board (波场论坛). All rights reserved.</p>
          <p className="mt-1">Built with ❤️ for the Web3 community.</p>
        </div>
      </div>
    </footer>
  )
}
