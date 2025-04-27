import { AuthSetup } from "@/components/admin/auth-setup"

export default function AuthTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Authentication Settings</h2>
      <p className="text-muted-foreground">
        Configure authentication settings and email templates for your application.
      </p>

      <div className="mt-6">
        <AuthSetup />
      </div>
    </div>
  )
}
