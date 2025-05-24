
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, Zap, UserCircle, ShieldCheck, MessageSquare, Activity, Award, UploadCloud, BarChart3, SparklesIcon, Compass, Dumbbell, Bot } from 'lucide-react'; // Added Bot

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
      title: "Guía Inicial",
      href: "/onboarding",
      icon: Compass,
    },
    {
      title: "Entrenamientos",
      href: "/workouts",
      icon: Dumbbell,
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
      title: "Chat IA",
      href: "/ai-chat",
      icon: Bot,
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
      title: "Guía Inicial",
      href: "/onboarding",
      icon: Compass,
      description: "Configura tus preferencias iniciales."
    },
    {
      title: "Mi Perfil",
      href: "/profile",
      icon: UserCircle,
      description: "Gestiona tu perfil y configuraciones."
    },
    {
      title: "Entrenamientos",
      href: "/workouts",
      icon: Dumbbell, 
      description: "Planes de ejercicio y guías."
    },
    {
      title: "Chat con IA",
      href: "/ai-chat",
      icon: Bot,
      description: "Consulta recetas y consejos con IA.",
    },
    {
      title: "Conectar",
      href: "/experts",
      icon: Users,
      description: "Encuentra entrenadores y nutricionistas certificados."
    },
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
     {
      title: "Sugerencias IA",
      href: "/dashboard#ai-suggestions",
      icon: SparklesIcon,
      description: "Obtén consejos personalizados.",
    },
  ],
};
