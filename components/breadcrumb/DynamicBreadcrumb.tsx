"use client"

import React, { type ReactNode, useMemo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Home } from "lucide-react"

type DynamicBreadcrumbProps = {
  homeElement: ReactNode
  homeHref?: string
  transformLabel?: (label: string) => string
  maxItems?: number
  showHome?: boolean
  customLabels?: Record<string, string>
}

// Enhanced label transformation with Polish medical terms
const defaultTransform = (label: string) => {
  const customLabels: Record<string, string> = {
    users: "Użytkownicy",
    organizations: "Jednostki Organizacyjne",
    permissions: "Uprawnienia",
    "api-docs": "Dokumentacja API",
    settings: "Ustawienia",
    profile: "Profil",
    dashboard: "Dashboard",
    help: "Pomoc",
    admin: "Administracja",
    reports: "Raporty",
    patients: "Pacjenci",
    doctors: "Lekarze",
    appointments: "Wizyty",
    medical: "Medyczne",
    billing: "Rozliczenia",
  }

  // Check for custom label first
  if (customLabels[label.toLowerCase()]) {
    return customLabels[label.toLowerCase()]
  }

  // Default transformation
  return label
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

const DynamicBreadcrumb = ({
  homeElement,
  homeHref = "/",
  transformLabel = defaultTransform,
  maxItems = 5,
  showHome = true,
  customLabels = {},
}: DynamicBreadcrumbProps) => {
  const pathname = usePathname()

  const breadcrumbItems = useMemo(() => {
    const pathNames = pathname.split("/").filter((path) => path)

    // Apply custom labels if provided
    const enhancedTransform = (label: string) => {
      if (customLabels[label]) {
        return customLabels[label]
      }
      return transformLabel(label)
    }

    const items = pathNames.map((segment, index) => {
      const href = `/${pathNames.slice(0, index + 1).join("/")}`
      const label = enhancedTransform(segment)
      const isLast = index === pathNames.length - 1

      return {
        href,
        label,
        isLast,
        segment,
      }
    })

    // Handle overflow with ellipsis
    if (items.length > maxItems) {
      const firstItems = items.slice(0, 1)
      const lastItems = items.slice(-(maxItems - 2))
      return [...firstItems, { href: "", label: "...", isLast: false, segment: "ellipsis" }, ...lastItems]
    }

    return items
  }, [pathname, transformLabel, maxItems, customLabels])

  const isHomePage = pathname === homeHref

  return (
    <nav role="navigation" aria-label="Breadcrumb" className="flex items-center space-x-1">
      <Breadcrumb>
        <BreadcrumbList>
          {showHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={homeHref}
                    className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                      isHomePage ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">{homeElement}</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbItems.length > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </>
          )}

          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={`${item.href}-${index}`}>
              <BreadcrumbItem>
                {item.segment === "ellipsis" ? (
                  <span className="text-muted-foreground">...</span>
                ) : item.isLast ? (
                  <BreadcrumbPage className="font-medium text-foreground max-w-[200px] truncate">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors max-w-[150px] truncate"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && item.segment !== "ellipsis" && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  )
}

export default DynamicBreadcrumb
