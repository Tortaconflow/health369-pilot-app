"use client";

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserNav } from './UserNav';
import { cn } from '@/lib/utils';
import LogoIcon from '@/components/icons/LogoIcon';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { open, setOpen, isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <LogoIcon className="h-7 w-7" />
            <span className={cn("text-lg", open || isMobile ? "inline" : "hidden group-data-[collapsible=icon]:hidden")}>
              Health369
            </span>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent className="p-2">
            <SidebarMenu>
              {siteConfig.sidebarNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                      className="w-full justify-start"
                      onClick={() => isMobile && setOpen(false)}
                      tooltip={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                       <span className={cn(open || isMobile ? "inline" : "hidden group-data-[collapsible=icon]:hidden")}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="p-4 border-t">
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="md:hidden">
             <SidebarTrigger />
          </div>
          <div className="flex-1">
            {/* Optional: Breadcrumbs or page title */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
