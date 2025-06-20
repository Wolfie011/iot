"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  color?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  color = "text-blue-600",
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trendDirection) {
      case "up":
        return <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        {trend && (
          <div className="flex items-center text-xs">
            {getTrendIcon()}
            <span className={getTrendColor()}>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
