"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

interface WidgetPlaceholderProps {
  onAddWidget?: () => void
  className?: string
}

export function WidgetPlaceholder({ onAddWidget, className }: WidgetPlaceholderProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-all duration-200 group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onAddWidget}
    >
      <CardContent className="flex flex-col items-center justify-center h-full min-h-[140px] p-6">
        <Button
          variant="ghost"
          size="icon"
          className={`h-12 w-12 rounded-full border-2 border-dashed transition-all duration-200 ${
            isHovered ? "border-primary bg-primary/10 text-primary" : "border-muted-foreground/25 text-muted-foreground"
          }`}
        >
          <Plus className={`h-6 w-6 transition-transform duration-200 ${isHovered ? "scale-110" : ""}`} />
        </Button>
        <p
          className={`text-xs mt-2 text-center transition-colors duration-200 ${
            isHovered ? "text-primary" : "text-muted-foreground"
          }`}
        >
          Dodaj widget
        </p>
      </CardContent>
    </Card>
  )
}
