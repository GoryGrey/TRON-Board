import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthSetupButton } from "./auth-setup-button"

export function AuthSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
        <CardDescription>Update your Supabase email templates with TRON Board branding</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to get instructions for updating your email templates in the Supabase dashboard. This
          will ensure that all authentication emails (confirmation, password reset, etc.) use your TRON Board branding.
        </p>
        <AuthSetupButton />
      </CardContent>
    </Card>
  )
}
