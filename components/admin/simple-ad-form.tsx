"use client"

import { useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAdAction } from "@/app/actions/ad-actions"
import { useToast } from "@/hooks/use-toast"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Ad"}
    </Button>
  )
}

export default function SimpleAdForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const [imageUrl, setImageUrl] = useState("")

  async function handleAction(formData: FormData) {
    console.log("SimpleAdForm: Starting form submission")

    // Add the image URL to the form data
    formData.append("imageUrl", imageUrl)

    console.log("SimpleAdForm: About to call createAdAction")
    const startTime = Date.now()

    const result = await createAdAction(formData)

    const duration = Date.now() - startTime
    console.log(`SimpleAdForm: createAdAction completed in ${duration}ms with result:`, result)

    if (result.success) {
      toast({
        title: "Ad Created",
        description: "Your ad has been created successfully",
      })

      // Reset the form
      formRef.current?.reset()
      setImageUrl("")
    } else {
      toast({
        title: "Failed to Create Ad",
        description: result.error || "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Ad Title</Label>
        <Input id="title" name="title" required placeholder="Enter ad title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" name="url" required placeholder="https://example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
