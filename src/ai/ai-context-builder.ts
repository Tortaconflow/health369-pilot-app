import { UserProfile } from "@/types/domain";

export interface SafeAIUserContext {
  heroRank: string;
  level: number;
  readinessScore: number;
  energyLevel: 'alta' | 'media' | 'baja';
  primaryGoal?: string;
  experienceLevel?: string;
  recentActivity?: string;
}

export class AIContextBuilder {
  /**
   * Construye un contexto mínimo y seguro para el modelo de IA
   * evitando la transmisión de datos sensibles o no necesarios.
   */
  public static buildSafeContext(
    hero: UserProfile,
    energyLevel: 'alta' | 'media' | 'baja' = 'media',
    readinessScore: number = 84,
    primaryGoal?: string
  ): SafeAIUserContext {
    return {
      heroRank: hero.heroRank,
      level: hero.level,
      readinessScore,
      energyLevel,
      primaryGoal: primaryGoal || "Aumentar masa muscular y vitalidad",
      experienceLevel: hero.level > 10 ? "avanzado" : hero.level > 4 ? "intermedio" : "principiante",
      recentActivity: `Racha de ${hero.streakDays} días activa. Nivel de fuerza STR: ${hero.heroAttributes.strength}/100.`,
    };
  }
}
