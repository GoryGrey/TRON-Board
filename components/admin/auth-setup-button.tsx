"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AuthSetupButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [instructions, setInstructions] = useState<string[]>([])
  const [templates, setTemplates] = useState<any>(null)
  const { toast } = useToast()

  const setupAuth = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/setup", {
        method: "GET",
      })

      const data = await response.json()

      if (response.ok) {
        setInstructions(data.instructions || [])
        setTemplates(data.templates || null)
        setIsOpen(true)
        toast({
          title: "Instructions ready",
          description: "Please follow the instructions to update email templates.",
        })
      } else {
        toast({
          title: "Failed to get instructions",
          description: data.error || "An error occurred.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error setting up auth:", error)
      toast({
        title: "Failed to get instructions",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={setupAuth} disabled={isLoading} className="w-full">
        {isLoading ? "Loading..." : "Email Template Instructions"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Template Setup Instructions</DialogTitle>
            <DialogDescription>Follow these steps to update your Supabase email templates</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Instructions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            {templates && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Template Content:</h3>

                {Object.entries(templates).map(([key, template]: [string, any]) => (
                  <div key={key} className="border rounded-md p-4 space-y-2">
                    <h4 className="font-medium capitalize">{key} Template</h4>
                    <div>
                      <p className="text-sm font-medium">Subject:</p>
                      <pre className="bg-muted p-2 rounded text-sm">{template.subject}</pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Content:</p>
                      <pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">{template.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
