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
  name: "Health369 Piloto",
  description: "Revolucionando las metas de salud y fitness con bienestar personalizado, conexiones con expertos y desafíos sociales gamificados.",
  url: "https://health369.example.com", // Reemplazar con tu URL real
  ogImage: "https://health369.example.com/og.jpg", // Reemplazar con tu URL real de imagen OG
  mainNav: [
    {
      title: "Panel de Control",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Expertos",
      href: "/experts",
      icon: Users,
    },
    {
      title: "Desafíos",
      href: "/challenges",
      icon: Zap,
    },
    {
      title: "Perfil",
      href: "/profile",
      icon: UserCircle,
    },
  ],
  sidebarNav: [
    {
      title: "Resumen",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Tu centro personal de salud y fitness."
    },
    {
      title: "Mi Perfil",
      href: "/profile",
      icon: UserCircle,
      description: "Gestiona tu perfil y configuraciones."
    },
    {
      title: "Conectar",
      href: "/experts",
      icon: Users,
      description: "Encuentra entrenadores y nutricionistas certificados."
    },
    // Placeholder for Communication Tools
    // {
    //   title: "Mensajes",
    //   href: "/messages",
    //   icon: MessageSquare,
    //   description: "Chatea con tus expertos."
    // },
    {
      title: "Desafíos",
      href: "/challenges",
      icon: Zap,
      description: "Únete o crea desafíos de fitness.",
      items: [
        { title: "Explorar Desafíos", href: "/challenges", icon: Activity },
        { title: "Crear Nuevo Desafío", href: "/challenges/create", icon: Award },
      ],
    },
    // Placeholder for Progress Registration (often part of a challenge)
    // {
    //   title: "Registrar Progreso",
    //   href: "/progress/log",
    //   icon: BarChart3,
    //   description: "Realiza un seguimiento de tu viaje de fitness."
    // },
    // Placeholder for Photo Authentication (integrated into progress/challenges)
    // {
    //   title: "Gestor de Fotos",
    //   href: "/photos/manage",
    //   icon: UploadCloud,
    //   description: "Gestiona tus fotos de progreso."
    // },
     {
      title: "Sugerencias IA",
      href: "/dashboard#ai-suggestions", // Or a dedicated page /ai-suggestions
      icon: SparklesIcon,
      description: "Obtén consejos personalizados.",
    },
  ],
};
