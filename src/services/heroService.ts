"use client";

import { UserProfile, HeroRank, HeroAttributes } from "@/types/domain";
import { initialMockHeroProfile, HERO_RANKS } from "@/lib/gamification";

const STORAGE_KEY = "valky369_hero_state_v1";

export type XPActionType =
  | 'workout_completed'
  | 'set_completed'
  | 'daily_checkin'
  | 'hydration_met'
  | 'nutrition_logged'
  | 'express_workout'
  | 'streak_shield';

export interface XPReward {
  xp: number;
  str?: number;
  end?: number;
  vit?: number;
  agi?: number;
  mnd?: number;
  rec?: number;
  message: string;
}

const ACTION_REWARDS: Record<XPActionType, XPReward> = {
  workout_completed: { xp: 250, str: 5, end: 3, mnd: 4, message: "¡Entrenamiento Completado! (+250 XP, +5 STR, +3 END)" },
  set_completed: { xp: 15, str: 1, message: "¡Serie Registrada! (+15 XP, +1 STR)" },
  daily_checkin: { xp: 25, rec: 2, mnd: 2, message: "¡Check-in Diario Completado! (+25 XP, +2 REC)" },
  hydration_met: { xp: 30, vit: 2, rec: 1, message: "¡Meta de Hidratación Lograda! (+30 XP, +2 VIT)" },
  nutrition_logged: { xp: 40, vit: 4, message: "¡Nutrición Registrada! (+40 XP, +4 VIT)" },
  express_workout: { xp: 120, end: 2, mnd: 3, message: "¡Misión Express Completada! (+120 XP, Racha Salvada 🔥)" },
  streak_shield: { xp: 50, mnd: 5, message: "¡Guardián de Racha Activado! (+50 XP, +5 MND)" }
};

export class HeroService {
  private static getProfile(): UserProfile {
    if (typeof window === "undefined") return initialMockHeroProfile;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read hero state from localStorage", e);
    }
    return initialMockHeroProfile;
  }

  private static saveProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      // Dispatch custom event for real-time reactivity across components
      window.dispatchEvent(new CustomEvent("valky_hero_updated", { detail: profile }));
    } catch (e) {
      console.warn("Could not save hero state to localStorage", e);
    }
  }

  public static getHero(): UserProfile {
    return this.getProfile();
  }

  public static calculateRank(level: number): HeroRank {
    if (level >= 51) return 'Valkyria Suprema';
    if (level >= 31) return 'Superhéroe Titán';
    if (level >= 16) return 'Campeón de Asgard';
    if (level >= 6) return 'Guerrero Valkyrie';
    return 'Iniciado';
  }

  public static awardAction(action: XPActionType, customPayload?: Partial<XPReward>): { profile: UserProfile; reward: XPReward; leveledUp: boolean } {
    const profile = { ...this.getProfile() };
    const baseReward = ACTION_REWARDS[action];
    const reward: XPReward = {
      ...baseReward,
      ...customPayload,
      xp: customPayload?.xp ?? baseReward.xp,
      message: customPayload?.message ?? baseReward.message,
    };

    profile.experiencePoints += reward.xp;
    let leveledUp = false;

    // Check level up
    while (profile.experiencePoints >= profile.xpToNextLevel) {
      profile.experiencePoints -= profile.xpToNextLevel;
      profile.level += 1;
      profile.xpToNextLevel = Math.round(profile.xpToNextLevel * 1.25);
      profile.virtualCurrency += 50;
      profile.heroRank = this.calculateRank(profile.level);
      leveledUp = true;
    }

    // Update attributes
    profile.heroAttributes = {
      strength: Math.min(100, profile.heroAttributes.strength + (reward.str || 0)),
      endurance: Math.min(100, profile.heroAttributes.endurance + (reward.end || 0)),
      vitality: Math.min(100, profile.heroAttributes.vitality + (reward.vit || 0)),
      agility: Math.min(100, profile.heroAttributes.agility + (reward.agi || 0)),
      discipline: Math.min(100, profile.heroAttributes.discipline + (reward.mnd || 0)),
      recovery: Math.min(100, (profile.heroAttributes.recovery ?? 80) + (reward.rec || 0)),
    };

    this.saveProfile(profile);
    return { profile, reward, leveledUp };
  }
}
