import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { emailTemplates } from "@/lib/email-templates"

// Create a Supabase admin client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function GET() {
  try {
    // Update the email templates in Supabase Auth
    const { error: confirmationError } = await supabaseAdmin.auth.admin.updateConfig({
      email_template_confirmation: {
        subject: emailTemplates.confirmationEmail.subject,
        content: emailTemplates.confirmationEmail.html("{{ .ConfirmationURL }}"),
      },
    })

    if (confirmationError) {
      console.error("Error updating confirmation email template:", confirmationError)
      return NextResponse.json({ error: "Failed to update confirmation email template" }, { status: 500 })
    }

    // Update the reset password email template
    const { error: resetError } = await supabaseAdmin.auth.admin.updateConfig({
      email_template_recovery: {
        subject: emailTemplates.resetPasswordEmail.subject,
        content: emailTemplates.resetPasswordEmail.html("{{ .SiteURL }}/reset-password#token={{ .Token }}"),
      },
    })

    if (resetError) {
      console.error("Error updating reset password email template:", resetError)
      return NextResponse.json({ error: "Failed to update reset password email template" }, { status: 500 })
    }

    // Update the magic link email template
    const { error: magicLinkError } = await supabaseAdmin.auth.admin.updateConfig({
      email_template_magic_link: {
        subject: emailTemplates.magicLinkEmail.subject,
        content: emailTemplates.magicLinkEmail.html("{{ .MagicLink }}"),
      },
    })

    if (magicLinkError) {
      console.error("Error updating magic link email template:", magicLinkError)
      return NextResponse.json({ error: "Failed to update magic link email template" }, { status: 500 })
    }

    // Update the sender email address
    const { error: senderError } = await supabaseAdmin.auth.admin.updateConfig({
      email_settings: {
        sender_name: "Yī Bāng",
        sender_address: "no-reply@tronboarding.com",
      },
    })

    if (senderError) {
      console.error("Error updating sender email settings:", senderError)
      return NextResponse.json({ error: "Failed to update sender email settings" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email templates updated successfully" })
  } catch (error) {
    console.error("Error in setup-email-templates route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
