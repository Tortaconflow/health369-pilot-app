import { HeroAttributes, HeroRank, DailyQuest, UserProfile } from "@/types/domain";

export const XP_PER_LEVEL = 500;

export const HERO_RANKS: HeroRank[] = [
  'Iniciado',
  'Guerrero Valkyrie',
  'Campeón de Asgard',
  'Superhéroe Titán',
  'Valkyria Suprema'
];

export function calculateHeroRank(level: number): HeroRank {
  if (level >= 50) return 'Valkyria Suprema';
  if (level >= 30) return 'Superhéroe Titán';
  if (level >= 15) return 'Campeón de Asgard';
  if (level >= 6) return 'Guerrero Valkyrie';
  return 'Iniciado';
}

export function getRankBadgeColor(rank: HeroRank): { bg: string; text: string; border: string; glow: string } {
  switch (rank) {
    case 'Valkyria Suprema':
      return { bg: 'bg-gradient-to-r from-purple-600 to-amber-500', text: 'text-white', border: 'border-amber-400', glow: 'shadow-purple-500/50' };
    case 'Superhéroe Titán':
      return { bg: 'bg-gradient-to-r from-cyan-600 to-blue-600', text: 'text-white', border: 'border-cyan-400', glow: 'shadow-cyan-500/50' };
    case 'Campeón de Asgard':
      return { bg: 'bg-gradient-to-r from-amber-500 to-yellow-600', text: 'text-white', border: 'border-yellow-400', glow: 'shadow-amber-500/50' };
    case 'Guerrero Valkyrie':
      return { bg: 'bg-gradient-to-r from-emerald-600 to-teal-600', text: 'text-white', border: 'border-emerald-400', glow: 'shadow-emerald-500/50' };
    default:
      return { bg: 'bg-slate-700', text: 'text-slate-100', border: 'border-slate-500', glow: 'shadow-slate-500/30' };
  }
}

export const initialMockHeroProfile: UserProfile = {
  id: "valky-hero-1",
  name: "Alex Valquiria",
  email: "alex@valky.app",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  level: 8,
  experiencePoints: 3750,
  xpToNextLevel: 4000,
  heroRank: "Guerrero Valkyrie",
  streakDays: 14,
  virtualCurrency: 850,
  heroAttributes: {
    strength: 78,   // STR
    endurance: 65,  // END
    vitality: 82,   // VIT (Nutrición / Salud)
    agility: 60,    // AGI
    discipline: 90, // MND (Racha & Constancia)
    recovery: 85,   // REC (Recuperación & Sueño)
  },
  badges: [
    "🔥 Racha de 14 Días",
    "🛡️ Escudo de Valkiria",
    "🥗 Maestro de Macros",
    "⚡ Titán del HIIT",
    "🏆 Vencedor de Desafío"
  ],
  healthGoals: ["Ganar masa muscular magra", "Optimizar digestión y energía", "Completar Desafío 30 Días"],
  progress: {
    weight: 72.4,
    waist: 77.0,
    muscleMassPercentage: 24.5,
    lastUpdated: new Date().toISOString(),
  },
  activeNutritionPlan: {
    id: "plan-valky-1",
    expertId: "expert1",
    expertName: "Dra. Emilia Campos (Nutricionista Certificada)",
    assignedDate: "2026-08-10",
    title: "Plan de Recomposición Corporal & Alto Rendimiento",
    dailyCaloriesTarget: 2350,
    macros: {
      proteinGrams: 165,
      carbsGrams: 240,
      fatsGrams: 65,
    },
    guidelines: [
      "Consumir 30g de proteína en los primeros 45 min post-entreno.",
      "Mantener hidratación mínima de 2.8L de agua diaria.",
      "Priorizar fuentes de carbohidratos complejos en comidas 1 y 3."
    ],
    meals: [
      { time: "08:00 AM", name: "Desayuno Anabólico", description: "Omelette de 3 huevos + claras con espinacas y avena con frutos rojos", calories: 580 },
      { time: "01:30 PM", name: "Almuerzo de Guerrero", description: "Pechuga a la plancha (180g), arroz jazmín (150g) y mix de verduras al vapor", calories: 720 },
      { time: "05:00 PM", name: "Snack Pre-Workout", description: "Batido de proteína aislado con plátano y crema de cacahuete", calories: 380 },
      { time: "08:30 PM", name: "Cena de Recuperación", description: "Salmón al horno (160g) con batata asada y ensalada verde con aceite de oliva", calories: 670 }
    ]
  }
};

export const defaultDailyQuests: DailyQuest[] = [
  {
    id: "quest-1",
    title: "Levantamiento Heroico",
    description: "Completa tu sesión de entrenamiento de fuerza programada para hoy.",
    category: "strength",
    xpReward: 150,
    attributeBoost: { attribute: "strength", points: 2 },
    completed: true,
    iconType: "Dumbbell"
  },
  {
    id: "quest-2",
    title: "Nutrición Valkiria Impecable",
    description: "Cumple con tu meta de 160g+ de proteína según tu plan nutricional.",
    category: "vitality",
    xpReward: 120,
    attributeBoost: { attribute: "vitality", points: 2 },
    completed: false,
    iconType: "Salad"
  },
  {
    id: "quest-3",
    title: "Cardio de Resistencia",
    description: "Registra al menos 30 minutos de actividad cardiovascular o 8,000 pasos.",
    category: "endurance",
    xpReward: 100,
    attributeBoost: { attribute: "endurance", points: 1 },
    completed: false,
    iconType: "Footprints"
  },
  {
    id: "quest-4",
    title: "Mente Inquebrantable",
    description: "Mantén tu racha activa registrando tu progreso o completando una reflexión.",
    category: "discipline",
    xpReward: 80,
    attributeBoost: { attribute: "discipline", points: 1 },
    completed: true,
    iconType: "Flame"
  }
];
