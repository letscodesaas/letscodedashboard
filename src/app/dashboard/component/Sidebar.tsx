/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';
import {
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Settings,
  Users,
  Briefcase,
  Package,
  Mail,
  MessageSquare,
  User,
} from 'lucide-react';

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { Separator } from '@radix-ui/react-separator';
import { useAuth } from '@/hooks/useAuth';

// Import your auth context - adjust the import path as needed
// import { AuthContext } from '@/context/Authcontext'

// Navigation items configuration
const navigationItems = [
  {
    title: 'General',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Task Manager',
    url: '/dashboard/taskmanager',
    icon: Calendar,
  },
  {
    title: 'Interview Experiences',
    url: '/dashboard/interview-experience',
    icon: MessageSquare,
  },
  {
    title: 'Public Profile',
    url: '/dashboard/public-profile',
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const LetsCodeLogo =
    'https://d3l4smlx4vuygm.cloudfront.net/IMG_20250123_135429_806.webp';

  const auth = useAuth();
  const { email, policy, id, role } = auth;

  const handleLogout = () => {
    window.sessionStorage.removeItem('token');
    window.location.replace('/');
  };

  // Conditional navigation items based on permissions
  const getConditionalItems = () => {
    const items = [];

    // Show everything to admin
    if (role === 'admin') {
      items.push(
        { title: 'Manage Teams', url: '/dashboard/team/manage', icon: Users },
        { title: 'Create Teams', url: '/dashboard/team/create', icon: Users },
        {
          title: 'Create Jobs',
          url: '/dashboard/jobs/create',
          icon: Briefcase,
        },
        {
          title: 'Show All Jobs',
          url: '/dashboard/jobs/show',
          icon: Briefcase,
        },
        {
          title: 'Create Products',
          url: '/dashboard/product/create',
          icon: Package,
        },
        {
          title: 'Show Products',
          url: '/dashboard/product/show',
          icon: Package,
        },
        { title: 'Newsletter', url: '/dashboard/newsletter', icon: Mail },
        { title: 'Show All Newsletters', url: '/published', icon: Mail }
      );
      return items;
    }

    // Non-admin: Policy-based access
    if (policy?.[2]?.access) {
      if (policy[2].resources.includes('Manage')) {
        items.push({
          title: 'Manage Teams',
          url: '/dashboard/team/manage',
          icon: Users,
        });
      }
      if (policy[2].resources.includes('Create')) {
        items.push({
          title: 'Create Teams',
          url: '/dashboard/team/create',
          icon: Users,
        });
      }
    }

    if (policy?.[0]?.access) {
      if (policy[0].resources.includes('Create')) {
        items.push({
          title: 'Create Jobs',
          url: '/dashboard/jobs/create',
          icon: Briefcase,
        });
      }
      if (policy[0].resources.includes('Manage')) {
        items.push({
          title: 'Show All Jobs',
          url: '/dashboard/jobs/show',
          icon: Briefcase,
        });
      }
    }

    if (policy?.[1]?.access) {
      if (policy[1].resources.includes('Create')) {
        items.push({
          title: 'Create Products',
          url: '/dashboard/product/create',
          icon: Package,
        });
      }
      if (policy[1].resources.includes('Manage')) {
        items.push({
          title: 'Show Products',
          url: '/dashboard/product/show',
          icon: Package,
        });
      }
    }

    if (policy?.[3]?.access) {
      if (policy[3].resources.includes('Create')) {
        items.push({
          title: 'Newsletter',
          url: '/dashboard/newsletter',
          icon: Mail,
        });
      }
      if (policy[3].resources.includes('Manage')) {
        items.push({
          title: 'Show All Newsletters',
          url: '/published',
          icon: Mail,
        });
      }
    }

    return items;
  };

  const conditionalItems = getConditionalItems();
  const userInitials = email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'LC';

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {/* <span className="text-xs font-bold">LC</span> */}
                  <img src={LetsCodeLogo} alt="Logo" className="h-6 w-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">LET'S CODE</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="my-2" />
      {/* <div className="px-4 text-sm text-muted-foreground">
                Policy: {
                    policy.map((p, index) => (
                        <span key={index} className="inline-block mr-1">
                            {p ? "✔️" : "❌"}
                        </span>
                    ))
                }
                Length: {policy.length} | Role: {role}
            </div>
            <Separator className="my-2" /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {conditionalItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Features</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conditionalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Settings />
                      <span>Account</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/dashboard/profile">
                            <User />
                            <span>Profile</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/dashboard/security">
                            <Settings />
                            <span>Security</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg" alt={email} />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userInitials}
                    </span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <a href="/dashboard/profile">
                    <User />
                    Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard/settings">
                    <Settings />
                    Settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
