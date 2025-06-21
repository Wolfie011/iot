import type React from "react"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { DynamicBreadcrumb } from "@/components/breadcrumb"
import { AccountActivationDialog } from "@/components/form/activate-account-form"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authorize } from "@/lib/server-utils"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/nav/mode-toggle"
import { Bell, Search, Settings, LogOut, User } from "lucide-react"
import { Suspense } from "react"

// Loading component for the header
function HeaderSkeleton() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 animate-pulse rounded bg-muted" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    </header>
  )
}

// Header component
async function ProtectedHeader({ user }: { user: any }) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DynamicBreadcrumb homeElement="Dashboard" />
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, session } = await authorize()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <AppSidebar authUser={user} />
      <SidebarInset>
        <Suspense fallback={<HeaderSkeleton />}>
          <ProtectedHeader user={user} />
        </Suspense>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-6 overflow-y-auto overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className="mx-auto w-full max-w-fit">{children}</div>

          {/* Account Activation Dialog - Only show if user is not active */}
          {user?.active === false && (
            <Suspense fallback={null}>
              <AccountActivationDialog />
            </Suspense>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
