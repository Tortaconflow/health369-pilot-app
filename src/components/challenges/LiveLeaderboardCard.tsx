"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Flame, Coins, ShieldCheck, ArrowUpRight } from "lucide-react";

interface LeaderboardParticipant {
  rank: number;
  name: string;
  avatarUrl: string;
  xpPoints: number;
  streakDays: number;
  verifiedPhotosCount: number;
  isCurrentUser?: boolean;
}

export function LiveLeaderboardCard() {
  const participants: LeaderboardParticipant[] = [
    { rank: 1, name: "Valentina Ruiz", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", xpPoints: 4850, streakDays: 28, verifiedPhotosCount: 4 },
    { rank: 2, name: "Alex Valquiria (Tú)", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", xpPoints: 3750, streakDays: 14, verifiedPhotosCount: 2, isCurrentUser: true },
    { rank: 3, name: "Mateo Silva", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", xpPoints: 3420, streakDays: 12, verifiedPhotosCount: 2 },
    { rank: 4, name: "Camila Vargas", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", xpPoints: 2980, streakDays: 9, verifiedPhotosCount: 1 },
  ];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <span className="bg-amber-400 text-slate-950 font-black p-1.5 rounded-full flex items-center justify-center h-6 w-6 text-xs shadow-md">🥇</span>;
      case 2: return <span className="bg-slate-300 text-slate-950 font-black p-1.5 rounded-full flex items-center justify-center h-6 w-6 text-xs shadow-md">🥈</span>;
      case 3: return <span className="bg-amber-700 text-white font-black p-1.5 rounded-full flex items-center justify-center h-6 w-6 text-xs shadow-md">🥉</span>;
      default: return <span className="text-xs font-bold text-muted-foreground ml-2">#{rank}</span>;
    }
  };

  return (
    <Card className="border-border/60 shadow-xl bg-card/90">
      <CardHeader className="pb-3 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-xl font-bold">Tabla de Clasificación en Vivo (Leaderboard)</CardTitle>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-bold gap-1">
            <Coins className="h-3.5 w-3.5" /> Pozo: 1,500 Monedas
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Puntos acumulados por misiones diarias, entrenamientos y fotos de progreso autenticadas con IA.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5">
        {participants.map((p) => (
          <div
            key={p.name}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              p.isCurrentUser
                ? "bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30"
                : "bg-background/60 border-border/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 flex justify-center">
                {getRankBadge(p.rank)}
              </div>
              <Avatar className="h-10 w-10 border border-primary/40">
                <AvatarImage src={p.avatarUrl} alt={p.name} />
                <AvatarFallback>{p.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">{p.name}</span>
                  {p.isCurrentUser && (
                    <Badge className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1 py-0">
                      Tú
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center text-rose-400 font-semibold">
                    <Flame className="h-3 w-3 mr-0.5 fill-rose-500" /> {p.streakDays}d racha
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-emerald-400 font-semibold">
                    <ShieldCheck className="h-3 w-3 mr-0.5" /> {p.verifiedPhotosCount} fotos verificadas
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-foreground">{p.xpPoints.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground block font-semibold">XP Total</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
