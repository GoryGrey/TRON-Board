"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  maxTags?: number
}

export default function TagInput({ tags, setTags, maxTags = 5 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const trimmedInput = inputValue.trim().toLowerCase()

    if (trimmedInput && !tags.includes(trimmedInput) && tags.length < maxTags) {
      if (trimmedInput.length > 20) {
        // Tag is too long
        return
      }

      setTags([...tags, trimmedInput])
      setInputValue("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1 text-sm">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-muted-foreground hover:text-foreground"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length < maxTags ? "Add a tag and press Enter" : "Maximum tags reached"}
        disabled={tags.length >= maxTags}
        className="bg-background/50 border border-border focus:border-primary"
      />

      <p className="text-xs text-muted-foreground">
        {tags.length}/{maxTags} tags used. Press Enter to add a tag.
      </p>
    </div>
  )
}
