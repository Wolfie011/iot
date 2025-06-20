"use client"

import React from "react"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbTrailItem {
  name: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface StaticBreadcrumbProps {
  trail: BreadcrumbTrailItem[]
  showPageTitle?: boolean
  className?: string
}

const StaticBreadcrumb = ({ trail, showPageTitle = true, className = "" }: StaticBreadcrumbProps) => {
  const lastIndex = trail.length - 1
  const currentPage = trail[lastIndex]

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      {showPageTitle && (
        <div className="flex items-center gap-2">
          {currentPage?.icon && <currentPage.icon className="h-6 w-6 text-muted-foreground" />}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{currentPage?.name}</h1>
        </div>
      )}

      <nav role="navigation" aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            {trail.map((item, index) => {
              const isLast = index === lastIndex

              return (
                <React.Fragment key={`${item.name}-${index}`}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-1 font-medium">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name}
                      </BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.name}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name}
                      </span>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </div>
  )
}

export default StaticBreadcrumb
