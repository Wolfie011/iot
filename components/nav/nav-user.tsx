"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { ChevronsUpDown, LogOut, Settings, User, Bell, Shield } from "lucide-react"
import Link from "next/link"
import type { User as LuciaUser } from "lucia"

interface NavUserProps {
  authUser: LuciaUser
}

export function NavUser({ authUser }: NavUserProps) {
  const { isMobile } = useSidebar()

  // Create full name from firstName and lastName
  const fullName =
    authUser?.firstName && authUser?.lastName
      ? `${authUser.firstName} ${authUser.lastName}`.trim()
      : authUser?.firstName || authUser?.lastName || authUser?.userName || "Użytkownik"

  // Generate initials properly
  const userInitials = (() => {
    if (authUser?.firstName && authUser?.lastName) {
      return `${authUser.firstName[0]}${authUser.lastName[0]}`.toUpperCase()
    }
    if (authUser?.firstName) {
      return authUser.firstName.slice(0, 2).toUpperCase()
    }
    if (authUser?.lastName) {
      return authUser.lastName.slice(0, 2).toUpperCase()
    }
    if (authUser?.userName) {
      return authUser.userName.slice(0, 2).toUpperCase()
    }
    if (authUser?.email) {
      return authUser.email[0].toUpperCase()
    }
    return "U"
  })()

  // Display name for the dropdown
  const displayName = fullName

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={authUser?.avatar || "/placeholder.svg"} alt={`${displayName} avatar`} />
                <AvatarFallback className="rounded-lg text-xs font-medium">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{authUser?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={authUser?.avatar || "/placeholder.svg"} alt={`${displayName} avatar`} />
                  <AvatarFallback className="rounded-lg text-xs font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{authUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profil użytkownika
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Ustawienia
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Powiadomienia
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950" asChild>
              <Link href="/sign-out" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj się
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
