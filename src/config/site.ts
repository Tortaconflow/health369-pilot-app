import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, Zap, UserCircle, ShieldCheck, MessageSquare, Activity, Award, UploadCloud, BarChart3, SparklesIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
};

export type SidebarNavItem = NavItem & {
  items?: NavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

export const siteConfig: SiteConfig = {
  name: "Health369 Pilot",
  description: "Revolutionizing health and fitness goals with personalized wellness, expert connections, and gamified social challenges.",
  url: "https://health369.example.com", // Replace with your actual URL
  ogImage: "https://health369.example.com/og.jpg", // Replace with your actual OG image URL
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Experts",
      href: "/experts",
      icon: Users,
    },
    {
      title: "Challenges",
      href: "/challenges",
      icon: Zap,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: UserCircle,
    },
  ],
  sidebarNav: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Your personal health and fitness hub."
    },
    {
      title: "My Profile",
      href: "/profile",
      icon: UserCircle,
      description: "Manage your profile and settings."
    },
    {
      title: "Connect",
      href: "/experts",
      icon: Users,
      description: "Find certified trainers and nutritionists."
    },
    // Placeholder for Communication Tools
    // {
    //   title: "Messages",
    //   href: "/messages",
    //   icon: MessageSquare,
    //   description: "Chat with your experts."
    // },
    {
      title: "Challenges",
      href: "/challenges",
      icon: Zap,
      description: "Join or create fitness challenges.",
      items: [
        { title: "Browse Challenges", href: "/challenges", icon: Activity },
        { title: "Create New Challenge", href: "/challenges/create", icon: Award },
      ],
    },
    // Placeholder for Progress Registration (often part of a challenge)
    // {
    //   title: "Log Progress",
    //   href: "/progress/log",
    //   icon: BarChart3,
    //   description: "Track your fitness journey."
    // },
    // Placeholder for Photo Authentication (integrated into progress/challenges)
    // {
    //   title: "Photo Manager",
    //   href: "/photos/manage",
    //   icon: UploadCloud,
    //   description: "Manage your progress photos."
    // },
     {
      title: "AI Suggestions",
      href: "/dashboard#ai-suggestions", // Or a dedicated page /ai-suggestions
      icon: SparklesIcon,
      description: "Get personalized tips.",
    },
  ],
};
