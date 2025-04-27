import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AsciiArt from "@/components/ascii-art"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 pixel-text glow-text text-primary">
        About TRON Board
        <span className="chinese-caption block">关于波场论坛</span>
      </h1>

      <AsciiArt type="divider" />

      <Card className="mb-8 border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="pixel-text">Our Story</CardTitle>
          <CardDescription>The journey of TRON Board</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            TRON Board (波场论坛) was born from a vision to create a TRON-first crypto message board that captures the
            vibrant energy of the TRON ecosystem while embracing the decentralized ethos of Web3.
          </p>
          <p>
            While our platform is built primarily for the TRON ecosystem, we welcome discussions, bounties, predictions,
            and research about all blockchain networks. We believe in fostering cross-chain dialogue and collaboration.
          </p>
          <p>
            TRON Board embodies our mission: to create a digital crossroads where the crypto community can exchange
            ideas, share knowledge, and build connections in a space that prioritizes the TRON ecosystem while remaining
            open to the broader blockchain world.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8 border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="pixel-text">Our Vision</CardTitle>
          <CardDescription>Building the future of decentralized communication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We believe in a future where online communities are owned by their members, where contribution is rewarded,
            and where digital identity carries real value. TRON Board is our contribution to this future.
          </p>
          <p>
            By combining the best elements of traditional forum culture with blockchain technology, we're creating a
            platform that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Rewards quality content and community participation</li>
            <li>Preserves user ownership of data and digital identity</li>
            <li>Fosters authentic connections between crypto enthusiasts</li>
            <li>Celebrates the unique cultural elements that make the crypto space diverse and vibrant</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <p className="mb-4">Have questions or want to get in touch?</p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors pixel-text"
        >
          Contact Us
          <span className="chinese-caption block">联系我们</span>
        </Link>
      </div>
    </div>
  )
}
