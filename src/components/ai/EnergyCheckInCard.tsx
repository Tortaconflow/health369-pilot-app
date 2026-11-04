"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BatteryCharging, BatteryMedium, BatteryLow, Zap, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnergyCheckInCardProps {
  onSelectEnergy?: (level: 'alta' | 'media' | 'baja') => void;
}

export function EnergyCheckInCard({ onSelectEnergy }: EnergyCheckInCardProps) {
  const [selectedEnergy, setSelectedEnergy] = useState<'alta' | 'media' | 'baja' | null>('media');
  const { toast } = useToast();

  const handleSelect = (level: 'alta' | 'media' | 'baja') => {
    setSelectedEnergy(level);
    if (onSelectEnergy) onSelectEnergy(level);

    const messages = {
      alta: "⚡ ¡Modo Titán activado! Valky AI preparará tu sesión con máxima intensidad.",
      media: "🔋 Ritmo constante y controlado. La consistencia es la clave del superhéroe.",
      baja: "🪫 Día de recuperación activa. Ajustaremos tu meta a una sesión suave de 10-15 min para salvar tu racha sin agotarte."
    };

    toast({
      title: "Estado de Energía Registrado (+15 XP)",
      description: messages[level],
      className: "bg-primary text-primary-foreground font-bold",
    });
  };

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card via-card to-amber-950/10 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-lg font-bold">¿Cómo te sientes de energía hoy?</CardTitle>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs font-bold">
            Adaptación Inteligente
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Valky AI ajusta tu entrenamiento y nutrición según tu nivel real de energía para evitar el agotamiento.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleSelect('alta')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedEnergy === 'alta'
                ? "bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/40 text-foreground font-black"
                : "bg-background/80 border-border/50 hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <Zap className={`h-6 w-6 ${selectedEnergy === 'alta' ? "text-rose-500 fill-rose-500" : "text-muted-foreground"}`} />
            <span className="text-xs font-bold">⚡ Alta / Con Todo</span>
            <span className="text-[10px] opacity-75">Sesión completa</span>
          </button>

          <button
            onClick={() => handleSelect('media')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedEnergy === 'media'
                ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40 text-foreground font-black"
                : "bg-background/80 border-border/50 hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <BatteryMedium className={`h-6 w-6 ${selectedEnergy === 'media' ? "text-amber-400" : "text-muted-foreground"}`} />
            <span className="text-xs font-bold">🔋 Media / Normal</span>
            <span className="text-[10px] opacity-75">Ritmo estándar</span>
          </button>

          <button
            onClick={() => handleSelect('baja')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedEnergy === 'baja'
                ? "bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40 text-foreground font-black"
                : "bg-background/80 border-border/50 hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <Heart className={`h-6 w-6 ${selectedEnergy === 'baja' ? "text-emerald-400 fill-emerald-400" : "text-muted-foreground"}`} />
            <span className="text-xs font-bold">🪫 Cansado / Poco tiempo</span>
            <span className="text-[10px] opacity-75">Express 10 min</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
