import type { LucideIcon } from 'lucide-react';
import { 
  Shield, 
  Users, 
  Zap, 
  UserCircle, 
  Dumbbell, 
  Bot, 
  Utensils, 
  Flame, 
  Trophy, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

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
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

export const siteConfig: SiteConfig = {
  name: "Valky 369",
  tagline: "El Código de Transformación Heroica (RPG + Nutrición Clínica + IA)",
  description: "Desbloquea tu potencial de superhéroe fitness con el código 3-6-9. Stats RPG, nutrición con la Red Valkiria y coaching adaptativo con IA.",
  url: "https://valky369.app",
  ogImage: "https://valky369.app/og.jpg",
  mainNav: [
    {
      title: "Hero HQ",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Superhéroe & Stats",
      href: "/profile",
      icon: Shield,
    },
    {
      title: "Entrenamientos",
      href: "/workouts",
      icon: Dumbbell,
    },
    {
      title: "Red Valkiria de Nutrición",
      href: "/experts",
      icon: Utensils,
    },
    {
      title: "Valky AI Coach",
      href: "/ai-chat",
      icon: Bot,
    },
    {
      title: "Desafíos Comunitarios",
      href: "/challenges",
      icon: Trophy,
    },
  ],
  sidebarNav: [
    {
      title: "Hero HQ (Dashboard)",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Tu centro de comando y stats del superhéroe."
    },
    {
      title: "Perfil & Atributos",
      href: "/profile",
      icon: Shield,
      description: "Radar de habilidades, rango e insignias."
    },
    {
      title: "Misiones & Rutinas",
      href: "/workouts",
      icon: Dumbbell, 
      description: "Misiones activas y biblioteca de ejercicios."
    },
    {
      title: "Nutrición & Expertos",
      href: "/experts",
      icon: Utensils,
      description: "Planes de alimentación y videollamadas con profesionales."
    },
    {
      title: "Valky AI Coach",
      href: "/ai-chat",
      icon: Bot,
      description: "Generador inteligente de planes y nutrición."
    },
    {
      title: "Desafíos & Rankings",
      href: "/challenges",
      icon: Trophy,
      description: "Compite y valida tu transformación física con fotos autenticadas."
    },
  ],
};
