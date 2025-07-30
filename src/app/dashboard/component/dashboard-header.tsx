"use client"

import React from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
    const pathname = usePathname()

    // Generate breadcrumbs based on current path
    const generateBreadcrumbs = () => {
        const paths = pathname.split("/").filter(Boolean)
        const breadcrumbs = []

        for (let i = 0; i < paths.length; i++) {
            const path = "/" + paths.slice(0, i + 1).join("/")
            const name = paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace("-", " ")

            breadcrumbs.push({
                name,
                path,
                isLast: i === paths.length - 1,
            })
        }

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                    {crumb.isLast ? (
                                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={crumb.path}>{crumb.name}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}
