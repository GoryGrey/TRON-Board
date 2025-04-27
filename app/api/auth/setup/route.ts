import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tronboarding.com"

    if (!supabaseUrl) {
      return NextResponse.json({ error: "Missing Supabase URL" }, { status: 500 })
    }

    // Instead of trying to update templates via API (which requires admin access),
    // we'll return instructions for manually updating templates in the Supabase Dashboard
    return NextResponse.json({
      success: true,
      message: "Please follow the instructions to update email templates",
      instructions: [
        "1. Go to the Supabase Dashboard: https://app.supabase.com",
        "2. Select your project",
        "3. Go to Authentication > Email Templates",
        "4. Update each template with the Yī Bāng branding",
        "5. For the site URL, use: " + siteUrl,
        "6. For the sender name, use: Yī Bāng",
      ],
      templates: {
        confirmation: {
          subject: "Confirm your email for Yī Bāng",
          content: `<h2>Welcome to Yī Bāng!</h2>
          <p>Follow this link to confirm your email address:</p>
          <p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
          <p>If you didn't create this account, you can safely ignore this email.</p>`,
        },
        recovery: {
          subject: "Reset your Yī Bāng password",
          content: `<h2>Reset your Yī Bāng password</h2>
          <p>Follow this link to reset the password for your account:</p>
          <p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>`,
        },
        magic_link: {
          subject: "Your Yī Bāng login link",
          content: `<h2>Login to Yī Bāng</h2>
          <p>Follow this link to log in to your account:</p>
          <p><a href="{{ .ConfirmationURL }}">Log in to Yī Bāng</a></p>
          <p>If you didn't request this link, you can safely ignore this email.</p>`,
        },
        invite: {
          subject: "You've been invited to join Yī Bāng",
          content: `<h2>You've been invited to join Yī Bāng!</h2>
          <p>Follow this link to accept the invite:</p>
          <p><a href="{{ .ConfirmationURL }}">Accept invitation</a></p>`,
        },
      },
    })
  } catch (error) {
    console.error("Error in auth setup:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
