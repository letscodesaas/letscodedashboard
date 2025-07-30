// src/app/dashboard/layout.tsx
import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import Authcontext from "@/context/Authcontext"
import { AppSidebar } from "./component/Sidebar"
import { DashboardHeader } from "./component/dashboard-header"
interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Authcontext>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Authcontext>
  )
}
