"use client"

import type * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronsUpDown, Users, Building2, Shield, FileText, LayoutDashboard, Settings, HelpCircle } from "lucide-react"
import { NavUser } from "@/components/nav/nav-user"
import type { User as LuciaUser } from "lucia"

// Enhanced navigation configuration with icons and descriptions
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Użytkownicy",
          url: "/users",
          icon: Users,
          description: "Zarządzaj użytkownikami systemu",
        },
        {
          title: "IIoT",
          url: "/iiots",
          icon: Building2,
          description: "Struktura systemu IIoT",
        },
        {
          title: "Uprawnienia",
          url: "/permissions",
          icon: Shield,
          description: "Zarządzaj uprawnieniami",
        },
      ],
    },
    {
      title: "Dokumentacja",
      url: "/docs",
      icon: FileText,
      items: [
        {
          title: "Dokumentacja API",
          url: "/api-docs",
          icon: FileText,
          description: "Pełna dokumentacja API",
        },
      ],
    },
  ],
  quickActions: [
    {
      title: "Ustawienia",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Pomoc",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  authUser: LuciaUser
}

export function AppSidebar({ authUser, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Function to check if a path is active
  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/") return true
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Logo */}
              <div className="flex size-10 aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image src="/icon.png" alt="MedicalTech Logo" width={32} height={32} className="rounded-md" priority />
              </div>

              {/* Application Title */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">MedicalTech</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Management System</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Image src="/icon.png" alt="MedicalTech" width={16} height={16} className="rounded-sm" />
              </div>
              <div className="font-medium text-muted-foreground">MedicalTech v2.0</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Settings className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Ustawienia systemu</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="flex items-center gap-2">
              <group.icon className="size-4" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild isActive={isActive(item.url)} className="group">
                            <Link href={item.url} className="flex items-center gap-2">
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Szybkie akcje</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser authUser={authUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
