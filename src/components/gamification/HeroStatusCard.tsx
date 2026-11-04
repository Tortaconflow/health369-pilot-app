"use client";

import { UserProfile } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Zap, Flame, Dumbbell, HeartPulse, Sparkles, Trophy, Brain, Wind } from "lucide-react";
import { getRankBadgeColor } from "@/lib/gamification";

interface HeroStatusCardProps {
  profile: UserProfile;
}

export function HeroStatusCard({ profile }: HeroStatusCardProps) {
  const rankColors = getRankBadgeColor(profile.heroRank);
  const xpPercent = Math.round((profile.experiencePoints / profile.xpToNextLevel) * 100);

  const attributes = [
    { label: "Fuerza (STR)", value: profile.heroAttributes.strength, icon: Dumbbell, color: "text-rose-500", barColor: "bg-rose-500", desc: "Entrenamientos con carga y volumen" },
    { label: "Resistencia (END)", value: profile.heroAttributes.endurance, icon: Flame, color: "text-amber-500", barColor: "bg-amber-500", desc: "Cardio y actividad sostenida" },
    { label: "Nutrición (VIT)", value: profile.heroAttributes.vitality, icon: HeartPulse, color: "text-emerald-500", barColor: "bg-emerald-500", desc: "Cumplimiento de macros y balance clínico" },
    { label: "Agilidad (AGI)", value: profile.heroAttributes.agility, icon: Wind, color: "text-cyan-500", barColor: "bg-cyan-500", desc: "HIIT, movilidad y tiempo de reacción" },
    { label: "Disciplina (MND)", value: profile.heroAttributes.discipline, icon: Brain, color: "text-purple-500", barColor: "bg-purple-500", desc: "Rachas de registro y consistencia" },
  ];

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl overflow-hidden relative">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-primary/50 shadow-md">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[11px] font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-background shadow">
                {profile.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-black tracking-tight">{profile.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${rankColors.bg} ${rankColors.text} border ${rankColors.border} text-xs font-bold shadow-sm`}>
                  <Shield className="h-3 w-3 mr-1" /> {profile.heroRank}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium flex items-center">
                  <Flame className="h-3.5 w-3.5 text-rose-500 mr-0.5 fill-rose-500" /> Racha {profile.streakDays} días
                </span>
              </div>
            </div>
          </div>

          {/* XP & Next Level Badge */}
          <div className="flex flex-col sm:items-end">
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{profile.experiencePoints.toLocaleString()}</span>
              <span className="text-muted-foreground font-normal text-xs">/ {profile.xpToNextLevel.toLocaleString()} XP</span>
            </div>
            <div className="w-full sm:w-48 mt-1.5">
              <Progress value={xpPercent} className="h-2 bg-muted" />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1">
              Faltan {profile.xpToNextLevel - profile.experiencePoints} XP para Nivel {profile.level + 1}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Atributos del Superhéroe (Radar de Barras estilo Notion RPG) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Atributos de Superhéroe (Hero Stats)
            </h3>
            <span className="text-xs text-primary font-medium">Inspirado en Progresión RPG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {attributes.map((attr) => (
              <div key={attr.label} className="p-3 rounded-xl bg-background/60 border border-border/40 hover:border-border transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <attr.icon className={`h-4 w-4 ${attr.color}`} />
                    <span className="text-xs font-bold">{attr.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-foreground">{attr.value}/100</span>
                </div>
                <div className="w-full bg-muted/70 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${attr.barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${attr.value}%` }} 
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{attr.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insignias Desbloqueadas */}
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 mb-2.5">
            <Trophy className="h-4 w-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Insignias & Logros de Valquiria</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="px-2.5 py-1 text-xs font-semibold bg-muted/60 hover:bg-muted border border-border/50">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
