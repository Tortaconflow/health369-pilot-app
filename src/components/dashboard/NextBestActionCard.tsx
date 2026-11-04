"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Flame, Shield, ArrowRight, CheckCircle2, Clock, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { HeroService } from "@/services/heroService";

export function NextBestActionCard() {
  const { toast } = useToast();
  const [isExpressMode, setIsExpressMode] = useState(false);

  const handleToggleExpress = () => {
    setIsExpressMode(!isExpressMode);
    toast({
      title: !isExpressMode ? "⚡ Modo Express Activado" : "🏋️ Modo Estándar Activado",
      description: !isExpressMode 
        ? "Misión adaptada a 15 min para cuidar tu racha sin agotarte." 
        : "Misión restaurada al protocolo completo de fuerza.",
    });
  };

  return (
    <Card className="border-border/70 shadow-2xl bg-gradient-to-r from-card via-card to-amber-950/20 overflow-hidden relative border-l-4 border-l-amber-500">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Context */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs font-black uppercase tracking-wider gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Próxima Acción Recomendada
              </Badge>
              <Badge variant="outline" className="text-muted-foreground text-xs font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" /> {isExpressMode ? "15-20 min" : "45 min"}
              </Badge>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {isExpressMode ? "Circuito Express de Mantenimiento" : "Protocolo de Fuerza: Torso & Core"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {isExpressMode
                  ? "4 ejercicios funcionales de peso corporal diseñados para mantener activo tu metabolismo y salvar tu racha de superhéroe."
                  : "Sesión estructurada de empuje y tracción con sobrecarga progresiva para aumentar tu atributo de Fuerza (STR)."}
              </p>
            </div>

            {/* Reward Preview */}
            <div className="flex items-center gap-4 text-xs font-bold pt-1">
              <span className="text-amber-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> Recompensa: {isExpressMode ? "+120 XP" : "+250 XP"}
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> Atributo: {isExpressMode ? "+2 END" : "+5 STR"}
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-emerald-400" /> Racha: +1 Día Protegido
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link href="/workouts" passHref>
              <Button className="w-full sm:w-auto lg:w-48 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black py-6 text-sm rounded-xl shadow-lg hover:opacity-95 gap-2">
                <Play className="h-4 w-4 fill-current" /> Iniciar Sesión Ahora
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={handleToggleExpress}
              className="w-full sm:w-auto lg:w-48 text-xs font-bold border-border/60 hover:bg-muted/50"
            >
              {isExpressMode ? "Cambiar a Rutina Completa" : "⚡ ¿Poco tiempo hoy? Modo Express"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
