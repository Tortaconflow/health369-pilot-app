"use client";

import { useState } from "react";
import { DailyQuest } from "@/types/domain";
import { defaultDailyQuests } from "@/lib/gamification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Dumbbell, Salad, Footprints, Flame, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { HeroService } from "@/services/heroService";

export function DailyQuestsCard() {
  const [quests, setQuests] = useState<DailyQuest[]>(defaultDailyQuests);
  const { toast } = useToast();

  const completedCount = quests.filter(q => q.completed).length;
  const totalXP = quests.filter(q => q.completed).reduce((acc, q) => acc + q.xpReward, 0);

  const getIcon = (type: string) => {
    switch (type) {
      case "Dumbbell": return <Dumbbell className="h-4 w-4 text-rose-500" />;
      case "Salad": return <Salad className="h-4 w-4 text-emerald-500" />;
      case "Footprints": return <Footprints className="h-4 w-4 text-amber-500" />;
      case "Flame": return <Flame className="h-4 w-4 text-purple-500" />;
      default: return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const toggleQuest = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        const nextCompleted = !q.completed;
        if (nextCompleted) {
          const attributeKey = q.attributeBoost.attribute as 'str' | 'end' | 'vit' | 'agi' | 'mnd' | 'rec';
          const { leveledUp, reward } = HeroService.awardAction('daily_checkin', {
            xp: q.xpReward,
            [attributeKey]: q.attributeBoost.points,
            message: `¡Misión Cumplida: ${q.title}!`,
          });

          toast({
            title: leveledUp ? "🎉 ¡SUBISTE DE NIVEL!" : `¡Misión Cumplida: ${q.title}!`,
            description: `+${q.xpReward} XP ganados y +${q.attributeBoost.points} a ${q.attributeBoost.attribute.toUpperCase()}`,
            className: "bg-emerald-600 text-white font-bold",
          });
        }
        return { ...q, completed: nextCompleted };
      }
      return q;
    }));
  };

  return (
    <Card className="border-border/60 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">Misiones Diarias del Superhéroe</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-xs">
            {completedCount}/{quests.length} Completadas
          </Badge>
        </div>
        <CardDescription>
          Cumple tus misiones de entrenamiento y nutrición para subir de nivel y desbloquear atributos.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {quests.map((quest) => (
          <div
            key={quest.id}
            onClick={() => toggleQuest(quest.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              quest.completed 
                ? "bg-emerald-500/10 border-emerald-500/30 opacity-90" 
                : "bg-background/80 border-border/50 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <button className="text-foreground hover:scale-110 transition-transform">
                {quest.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className={quest.completed ? "line-through text-muted-foreground text-sm font-semibold" : "text-sm font-bold text-foreground"}>
                    {quest.title}
                  </span>
                  <span className="p-1 rounded bg-muted/60">
                    {getIcon(quest.iconType)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{quest.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className="text-[11px] font-extrabold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <Zap className="h-3 w-3 mr-0.5 fill-current" /> +{quest.xpReward} XP
              </Badge>
            </div>
          </div>
        ))}

        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/30">
          <span>XP Ganado Hoy: <strong className="text-foreground">{totalXP} XP</strong></span>
          <span className="text-[11px] italic">Se reinicia cada 24 hrs</span>
        </div>
      </CardContent>
    </Card>
  );
}
