"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface BreadcrumbContextType {
  customLabels: Record<string, string>
  setCustomLabel: (key: string, label: string) => void
  removeCustomLabel: (key: string) => void
  clearCustomLabels: () => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({})

  const setCustomLabel = useCallback((key: string, label: string) => {
    setCustomLabels((prev) => ({ ...prev, [key]: label }))
  }, [])

  const removeCustomLabel = useCallback((key: string) => {
    setCustomLabels((prev) => {
      const { [key]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearCustomLabels = useCallback(() => {
    setCustomLabels({})
  }, [])

  return (
    <BreadcrumbContext.Provider
      value={{
        customLabels,
        setCustomLabel,
        removeCustomLabel,
        clearCustomLabels,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider")
  }
  return context
}
