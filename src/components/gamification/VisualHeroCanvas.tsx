"use client";

import { useState, useEffect } from "react";
import { UserProfile, HeroRank } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles, Zap, Flame, Crown, Sword, HeartPulse } from "lucide-react";
import { getRankBadgeColor } from "@/lib/gamification";
import { HeroService } from "@/services/heroService";

interface VisualHeroCanvasProps {
  profile?: UserProfile;
}

export function VisualHeroCanvas({ profile: initialProfile }: VisualHeroCanvasProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || HeroService.getHero());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setProfile(HeroService.getHero());
    };
    window.addEventListener("valky_hero_updated", handleUpdate);
    return () => window.removeEventListener("valky_hero_updated", handleUpdate);
  }, []);
  const rank = profile.heroRank;
  const rankColors = getRankBadgeColor(rank);

  const getRankAuraStyle = (rank: HeroRank) => {
    switch (rank) {
      case 'Valkyria Suprema':
        return "from-purple-600/40 via-amber-500/30 to-transparent animate-pulse";
      case 'Superhéroe Titán':
        return "from-cyan-500/40 via-blue-600/30 to-transparent animate-pulse";
      case 'Campeón de Asgard':
        return "from-amber-500/40 via-yellow-600/20 to-transparent";
      case 'Guerrero Valkyrie':
        return "from-emerald-500/40 via-teal-600/20 to-transparent";
      default:
        return "from-slate-600/30 to-transparent";
    }
  };

  return (
    <Card className="border-border/60 shadow-2xl bg-card overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-xl font-bold">Avatar & Armadura del Superhéroe</CardTitle>
          </div>
          <Badge className={`${rankColors.bg} ${rankColors.text} border ${rankColors.border} text-xs font-black`}>
            {rank}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Tu avatar evoluciona visualmente conforme acumulas XP en tus misiones y aumentas tus atributos.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="relative rounded-2xl bg-gradient-to-b from-muted/60 via-card to-background p-6 flex flex-col md:flex-row items-center justify-around gap-6 border border-border/40 overflow-hidden">
          {/* Animated Aura Background */}
          <div className={`absolute inset-0 bg-radial-gradient ${getRankAuraStyle(rank)} pointer-events-none opacity-70`} />

          {/* Central Hero Character Emblem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative h-48 w-48 rounded-full border-4 border-amber-400/60 p-2 shadow-2xl bg-background/80 flex items-center justify-center">
              {/* Glow Aura */}
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
              
              {/* Hero Silhouette / Emblem SVG */}
              <svg viewBox="0 0 100 100" className="h-36 w-36 drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                {/* Shield Outline */}
                <polygon points="50,6 90,24 90,66 50,92 10,66 10,24" fill="#0B1120" stroke="url(#heroGradient)" strokeWidth="3" />
                {/* Valkyrie Wings */}
                <path d="M22 30 L50 78 L78 30 L64 30 L50 56 L36 30 Z" fill="url(#heroGradient)" />
                {/* Core Star */}
                <polygon points="50,22 54,34 66,38 56,47 60,60 50,52 40,60 44,47 34,38 46,34" fill="#FFFFFF" />
              </svg>

              {/* Level Badge Pin */}
              <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full border-2 border-background shadow-lg">
                Nivel {profile.level}
              </div>
            </div>

            <span className="text-sm font-extrabold text-foreground mt-4">{profile.name}</span>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> Racha de {profile.streakDays} Días Activa
            </span>
          </div>

          {/* Core Hero Attributes Radar Breakdown */}
          <div className="z-10 space-y-2.5 w-full md:w-72">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Poder de Atributos:
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-rose-400">⚔️ Fuerza (STR)</span>
                <span>{profile.heroAttributes.strength}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${profile.heroAttributes.strength}%` }} />
              </div>

              <div className="flex justify-between font-bold pt-1">
                <span className="text-amber-400">🔥 Resistencia (END)</span>
                <span>{profile.heroAttributes.endurance}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${profile.heroAttributes.endurance}%` }} />
              </div>

              <div className="flex justify-between font-bold pt-1">
                <span className="text-emerald-400">🥗 Nutrición (VIT)</span>
                <span>{profile.heroAttributes.vitality}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${profile.heroAttributes.vitality}%` }} />
              </div>

              <div className="flex justify-between font-bold pt-1">
                <span className="text-purple-400">🧠 Disciplina (MND)</span>
                <span>{profile.heroAttributes.discipline}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${profile.heroAttributes.discipline}%` }} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
