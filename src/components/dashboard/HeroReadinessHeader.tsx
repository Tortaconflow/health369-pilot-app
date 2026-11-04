"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types/domain";
import { HeroService } from "@/services/heroService";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Flame, Coins, Sparkles, Activity, BatteryCharging, Heart, Zap } from "lucide-react";
import { getRankBadgeColor } from "@/lib/gamification";

export function HeroReadinessHeader() {
  const [hero, setHero] = useState<UserProfile>(HeroService.getHero());
  const readinessScore = 84; // Measured readiness based on sleep & recovery

  useEffect(() => {
    const handleUpdate = () => {
      setHero(HeroService.getHero());
    };
    window.addEventListener("valky_hero_updated", handleUpdate);
    return () => window.removeEventListener("valky_hero_updated", handleUpdate);
  }, []);

  const rankColors = getRankBadgeColor(hero.heroRank);
  const xpPercent = Math.min(100, Math.round((hero.experiencePoints / hero.xpToNextLevel) * 100));

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border/60 shadow-xl space-y-6">
      {/* Top Identity & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              HERO HQ • COMANDO VALKY 369
            </span>
            <Badge className={`${rankColors.bg} ${rankColors.text} border ${rankColors.border} text-xs font-black`}>
              {hero.heroRank}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            ¡Saludos, {hero.name}! ⚡
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Nivel {hero.level} • {hero.experiencePoints} / {hero.xpToNextLevel} XP para el siguiente rango
          </p>
        </div>

        {/* Readiness Multi-factor Gauge */}
        <div className="p-4 rounded-xl bg-background/80 border border-border/50 flex items-center gap-4 shrink-0">
          <div className="relative h-14 w-14 rounded-full border-4 border-amber-400/40 bg-amber-500/10 flex items-center justify-center">
            <span className="text-base font-black text-amber-400">{readinessScore}%</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Activity className="h-4 w-4 text-emerald-400" /> Preparación del Héroe: Óptima
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sueño: 7.5h • Fatiga: Baja • Energía: Alta
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar & Quick Stats */}
      <div className="space-y-3 pt-2 border-t border-border/20">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground">Progreso hacia Nivel {hero.level + 1}</span>
          <span className="text-amber-400">{xpPercent}%</span>
        </div>
        <Progress value={xpPercent} className="h-2 bg-muted" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/30 text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">⚔️ Fuerza</span>
            <p className="text-sm font-black text-rose-400">{hero.heroAttributes.strength}/100</p>
          </div>
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/30 text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">🔥 Resistencia</span>
            <p className="text-sm font-black text-amber-400">{hero.heroAttributes.endurance}/100</p>
          </div>
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/30 text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">🥗 Nutrición</span>
            <p className="text-sm font-black text-emerald-400">{hero.heroAttributes.vitality}/100</p>
          </div>
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/30 text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">🧠 Disciplina</span>
            <p className="text-sm font-black text-purple-400">{hero.heroAttributes.discipline}/100</p>
          </div>
        </div>
      </div>
    </div>
  );
}
