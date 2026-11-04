"use client";

import React, { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserNav } from './UserNav';
import { cn } from '@/lib/utils';
import LogoIcon from '@/components/icons/LogoIcon';
import { Flame, Shield, Coins, Sparkles, LayoutDashboard, Utensils, Bot, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { initialMockHeroProfile } from '@/lib/gamification';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { setOpen, isMobile } = useSidebar();
  const pathname = usePathname();
  const hero = initialMockHeroProfile;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobileNavItems = [
    { title: "HQ", href: "/dashboard", icon: LayoutDashboard },
    { title: "Stats", href: "/profile", icon: Shield },
    { title: "Nutri", href: "/experts", icon: Utensils },
    { title: "AI Coach", href: "/ai-chat", icon: Bot },
    { title: "Retos", href: "/challenges", icon: Trophy },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background" suppressHydrationWarning>
      {/* Desktop Sidebar */}
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-border/40 bg-card/70 backdrop-blur-md">
        <SidebarHeader className="p-4 border-b border-border/20">
          <Link href="/" className="flex items-center gap-3 font-bold text-foreground">
            <LogoIcon className="h-8 w-8 flex-shrink-0" />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                Valky 369
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-1">
                CÓDIGO 3-6-9 RPG
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent className="p-3">
            <SidebarMenu className="gap-1.5">
              {siteConfig.sidebarNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={cn(
                          "w-full justify-start gap-3 rounded-lg py-2.5 px-3 transition-all",
                          isActive 
                            ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary" 
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => mounted && isMobile && setOpen(false)}
                        tooltip={item.title}
                      >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="group-data-[collapsible=icon]:hidden text-sm">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="p-3 border-t border-border/20">
          <div className="rounded-xl p-3 bg-muted/40 border border-border/30 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-muted-foreground">Rango</span>
              <span className="text-amber-400 font-bold">{hero.heroRank}</span>
            </div>
            <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full" style={{ width: '75%' }} />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pb-16 md:pb-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/85 backdrop-blur-md px-4 md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 px-2.5 py-1 text-xs">
                <Shield className="h-3.5 w-3.5" /> Lvl {hero.level}
              </Badge>
              <Badge variant="outline" className="hidden sm:inline-flex bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1 px-2.5 py-1 text-xs">
                <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> {hero.streakDays}d
              </Badge>
              <Badge variant="outline" className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 px-2.5 py-1 text-xs">
                <Coins className="h-3.5 w-3.5 text-emerald-400" /> {hero.virtualCurrency}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/ai-chat" className="hidden sm:inline-flex">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-colors">
                <Sparkles className="h-3.5 w-3.5" /> Valky AI
              </span>
            </Link>
            <UserNav />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Ultra-Fast Responsive Mobile Bottom Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-lg border-t border-border/50 py-2 px-3 flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg text-xs font-bold transition-all min-w-[54px]",
                  isActive ? "text-primary font-black scale-105" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[10px]">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
