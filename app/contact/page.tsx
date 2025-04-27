import { Mail, Users } from "lucide-react"
import AsciiArt from "@/components/ascii-art"
import ContactForm from "@/components/contact-form"

export const metadata = {
  title: "Contact Us | TRON Board",
  description: "Get in touch with the TRON Board team for inquiries, partnerships, or technical support.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-primary glow-text pixel-text">
        Contact Us
        <span className="chinese-caption block">联系我们</span>
      </h1>

      <AsciiArt type="divider" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center mb-4">
            <Mail className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold pixel-text">Email Us</h2>
          </div>
          <p className="mb-4 text-muted-foreground">Send us a message and we'll get back to you</p>
          <p className="mb-4">
            Have a question, suggestion, or just want to say hello? Fill out the form and our team will respond as soon
            as possible.
          </p>
          <p>
            For business inquiries, partnerships, or technical support, please specify in your message so we can direct
            your inquiry to the right team.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center mb-4">
            <Users className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold pixel-text">Community</h2>
          </div>
          <p className="mb-4 text-muted-foreground">Join our community channels</p>
          <p className="mb-6">
            For real-time discussions, updates, and community interaction, join us on our social platforms:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 mr-3 text-white font-bold">
                T
              </span>
              <span>Twitter: @tronboard</span>
            </li>
            <li className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 mr-3 text-white font-bold">
                D
              </span>
              <span>Discord: TRON Board Community</span>
            </li>
            <li className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-teal-600 mr-3 text-white font-bold">
                T
              </span>
              <span>Telegram: t.me/tronboardOfficial</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-2 pixel-text">
          Send a Message
          <span className="block text-sm text-muted-foreground normal-case">
            Fill out the form below to get in touch with us
          </span>
        </h2>
        <ContactForm />
      </div>
    </div>
  )
}
