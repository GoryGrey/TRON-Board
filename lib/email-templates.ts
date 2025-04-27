// Email templates for authentication emails
export const emailTemplates = {
  // Confirmation email template
  confirmationEmail: {
    subject: "Welcome to TRON Board - Please confirm your email",
    html: (confirmationUrl: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Welcome to TRON Board!</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          Thank you for signing up. Please confirm your email address to complete your registration.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirm Email Address
          </a>
        </div>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} TRON Board. All rights reserved.
        </div>
      </div>
    `,
  },

  // Reset password email template
  resetPasswordEmail: {
    subject: "Reset your TRON Board password",
    html: (resetUrl: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} TRON Board. All rights reserved.
        </div>
      </div>
    `,
  },

  // Magic link email template
  magicLinkEmail: {
    subject: "Your TRON Board login link",
    html: (magicLinkUrl: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Login to TRON Board</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          Click the button below to log in to your account. This link will expire in 24 hours.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLinkUrl}" style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Log In
          </a>
        </div>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          If you didn't request this login link, you can safely ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} TRON Board. All rights reserved.
        </div>
      </div>
    `,
  },
}
