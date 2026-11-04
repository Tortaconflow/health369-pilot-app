"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Moon, Zap, BatteryMedium, Heart, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HeroService } from "@/services/heroService";

interface HeroReadinessGaugeProps {
  onEnergyChange?: (level: 'alta' | 'media' | 'baja') => void;
}

export function HeroReadinessGauge({ onEnergyChange }: HeroReadinessGaugeProps) {
  const { toast } = useToast();
  const [selectedEnergy, setSelectedEnergy] = useState<'alta' | 'media' | 'baja'>('media');

  const readinessScore = selectedEnergy === 'alta' ? 92 : selectedEnergy === 'media' ? 78 : 64;

  const handleSelectEnergy = (level: 'alta' | 'media' | 'baja') => {
    setSelectedEnergy(level);
    if (onEnergyChange) onEnergyChange(level);

    HeroService.awardAction('daily_checkin', {
      rec: level === 'baja' ? 4 : 2,
      message: "Check-in de energía guardado",
    });

    const messages = {
      alta: "⚡ Modo Titán activado: Sesión completa de fuerza y sobrecarga progresiva.",
      media: "🔋 Ritmo estándar: Progresión constante y técnica controlada.",
      baja: "🌙 Adaptación inteligente: Rutina express de 15 min o movilidad activa para cuidar tus articulaciones y salvar tu racha."
    };

    toast({
      title: `Estado del Héroe: ${level === 'alta' ? 'Alta' : level === 'media' ? 'Normal' : 'Recuperación'} (+25 XP)`,
      description: messages[level],
      className: "bg-primary text-primary-foreground font-bold",
    });
  };

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card via-card to-amber-950/10 shadow-xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                Estado del Héroe • Daily Readiness
              </CardTitle>
              <CardDescription className="text-xs">
                Evaluación multi-factor para adaptar la intensidad y evitar el sobreentrenamiento.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Preparación: {readinessScore}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Multi-factor Indicators Breakdown */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] text-muted-foreground block font-semibold">Sueño Medido</span>
            <span className="text-sm font-bold text-foreground">7.5 hrs</span>
            <span className="text-[9px] text-emerald-400 block font-medium">✓ Óptimo</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] text-muted-foreground block font-semibold">Fatiga Previa</span>
            <span className="text-sm font-bold text-foreground">Baja / Media</span>
            <span className="text-[9px] text-amber-400 block font-medium">~ Estimada IA</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] text-muted-foreground block font-semibold">Recuperación</span>
            <span className="text-sm font-bold text-foreground">85/100</span>
            <span className="text-[9px] text-purple-400 block font-medium">★ REC Atributo</span>
          </div>
        </div>

        {/* 3 Energy Selection Options */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground">Selecciona tu energía percibida hoy:</label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleSelectEnergy('alta')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                selectedEnergy === 'alta'
                  ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40 text-foreground font-black"
                  : "bg-background/80 border-border/50 hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <Zap className={`h-5 w-5 ${selectedEnergy === 'alta' ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
              <span className="text-xs font-bold">⚡ Alta</span>
              <span className="text-[10px] opacity-75">"Estoy listo"</span>
            </button>

            <button
              onClick={() => handleSelectEnergy('media')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                selectedEnergy === 'media'
                  ? "bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40 text-foreground font-black"
                  : "bg-background/80 border-border/50 hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <BatteryMedium className={`h-5 w-5 ${selectedEnergy === 'media' ? "text-emerald-400" : "text-muted-foreground"}`} />
              <span className="text-xs font-bold">🔋 Normal</span>
              <span className="text-[10px] opacity-75">"Ritmo estándar"</span>
            </button>

            <button
              onClick={() => handleSelectEnergy('baja')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                selectedEnergy === 'baja'
                  ? "bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/40 text-foreground font-black"
                  : "bg-background/80 border-border/50 hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <Moon className={`h-5 w-5 ${selectedEnergy === 'baja' ? "text-purple-400" : "text-muted-foreground"}`} />
              <span className="text-xs font-bold">🌙 Baja</span>
              <span className="text-[10px] opacity-75">"Algo ligero"</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
