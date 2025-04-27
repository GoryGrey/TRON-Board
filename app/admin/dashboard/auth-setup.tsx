import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthSetupButton } from "@/components/admin/auth-setup-button"

export function AuthSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth & Email Setup</CardTitle>
        <CardDescription>Configure authentication settings and customize email templates</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Click the button below to set up custom email templates and configure authentication settings. This will
          update the sender email, customize the email templates, and set the correct redirect URLs.
        </p>
        <AuthSetupButton />
      </CardContent>
    </Card>
  )
}
