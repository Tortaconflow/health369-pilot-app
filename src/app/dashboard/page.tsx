import { Button } from "@/components/ui/button";
import { UserProfile, AISuggestions as AISuggestionsType } from "@/types/domain";
import Link from "next/link";
import { 
  Sparkles, 
  Dumbbell, 
  Trophy, 
  Shield, 
  Utensils, 
  Bot,
} from "lucide-react";
import { HeroReadinessHeader } from "@/components/dashboard/HeroReadinessHeader";
import { NextBestActionCard } from "@/components/dashboard/NextBestActionCard";
import { DailyQuestsCard } from "@/components/gamification/DailyQuestsCard";
import { ActiveNutritionPlanCard } from "@/components/nutrition/ActiveNutritionPlanCard";
import { LiveLeaderboardCard } from "@/components/challenges/LiveLeaderboardCard";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl">
      {/* 1. Hero Readiness & Identity Header */}
      <HeroReadinessHeader />

      {/* 2. Next Best Action Engine Banner */}
      <NextBestActionCard />

      {/* 3. Main 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Daily Quests & Valkiria Nutrition Plan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Misiones Diarias */}
          <DailyQuestsCard />

          {/* Plan de Nutrición Activo (Aporte de Valkiria) */}
          <ActiveNutritionPlanCard />
        </div>

        {/* Right Column: AI Coach Quick Access & Live Community Leaderboard */}
        <div className="space-y-6">
          {/* Valky AI Coach Quick Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card to-purple-950/20 border border-border/60 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground">Valky AI Coach</h3>
                <p className="text-xs text-muted-foreground">Tu asistente empático de fitness y nutrición</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              ¿Dolor muscular, dudas de recetas o necesitas adaptar tu entrenamiento de hoy según tu energía?
            </p>

            <Link href="/ai-chat" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md text-xs py-5">
                <Sparkles className="h-4 w-4 mr-2" /> Consultar al Coach (+20 XP)
              </Button>
            </Link>
          </div>

          {/* Live Leaderboard */}
          <LiveLeaderboardCard />
        </div>
      </div>
    </div>
  );
}
