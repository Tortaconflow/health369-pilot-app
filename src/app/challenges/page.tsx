import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { PlusCircle, Search, Filter, Trophy, Coins, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { mockChallenges } from "@/lib/challenges";
import { LiveLeaderboardCard } from "@/components/challenges/LiveLeaderboardCard";

export default function ChallengesPage() {
  const challenges = mockChallenges;

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-card via-card to-amber-950/20 border border-border/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
            DESAFÍOS GAMIFICADOS VALKY 369
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Compite, Transfórmate y Gana Recompensas
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Únete a retos comunitarios con validación fotográfica por IA, sube en la clasificación en vivo y gana monedas virtuales.
          </p>
        </div>

        <Link href="/challenges/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 py-6 rounded-xl shadow-lg gap-2 text-sm">
            <PlusCircle className="h-4 w-4" /> Crear Mi Propio Desafío
          </Button>
        </Link>
      </div>

      {/* Grid: Challenges list + Live Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" /> Desafíos Disponibles
            </h2>
            <span className="text-xs text-muted-foreground font-semibold">
              {challenges.length} Desafíos Activos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>

        {/* Right col: Live Leaderboard */}
        <div className="space-y-6">
          <LiveLeaderboardCard />
        </div>
      </div>
    </div>
  );
}
