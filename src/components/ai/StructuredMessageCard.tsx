"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Activity, Utensils, Moon, AlertTriangle, Sparkles, ChevronRight, Check, HeartHandshake, Eye, Compass } from "lucide-react";
import { ValkyGuardian } from "@/ai/guardian/guardian-policy";
import { EmotionalNeedType } from "@/types/companion";

interface StructuredMessageCardProps {
  content: string;
  role: 'user' | 'assistant';
  onQuickReply?: (query: string) => void;
}

export function StructuredMessageCard({ content, role, onQuickReply }: StructuredMessageCardProps) {
  if (role === 'user') {
    return (
      <div className="bg-primary text-primary-foreground font-medium rounded-2xl rounded-tr-sm px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm max-w-2xl ml-auto">
        {content}
      </div>
    );
  }

  // Assistant Structured Parser
  const isRecoveryAdvice = content.toLowerCase().includes("recupera") || content.toLowerCase().includes("dolor") || content.toLowerCase().includes("agujeta");
  const isEmotionalFatigue = content.toLowerCase().includes("estoy aquí contigo") || content.toLowerCase().includes("necesitas ahora") || content.toLowerCase().includes("frustra");

  // Clinical Safety Warning Detection
  const hasMedicalAlert = content.toLowerCase().includes("señal de alerta detectada") || content.toLowerCase().includes("dificultad para respirar") || content.toLowerCase().includes("dolor de pecho") || content.toLowerCase().includes("mareo intenso");

  // Follow-up suggestions parser
  let followUpPills: string[] = [];
  if (content.toLowerCase().includes("en qué parte del cuerpo") || content.toLowerCase().includes("molestia")) {
    followUpPills = ["Piernas y Glúteos", "Espalda y Hombros", "Pectorales y Brazos", "Todo el cuerpo (Fatiga General)"];
  } else if (content.toLowerCase().includes("dulces") || content.toLowerCase().includes("saladas")) {
    followUpPills = ["Opciones dulces con avena/fruta", "Opciones saladas con huevo/atún/pollo", "Recetas económicas de 5 min"];
  } else if (content.toLowerCase().includes("casa") || content.toLowerCase().includes("gimnasio")) {
    followUpPills = ["Rutina de 3 días en casa (sin equipo)", "Rutina de 3 días en gimnasio", "Circuito express de 15 minutos"];
  }

  // Simple clean markdown formatter for assistant
  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  const handleSelectEmotionalNeed = (need: EmotionalNeedType) => {
    if (!onQuickReply) return;
    const response = ValkyGuardian.handleEmotionalNeed(need);
    onQuickReply(response);
  };

  return (
    <div className="bg-card text-foreground border border-border/50 rounded-2xl rounded-tl-sm p-4 md:p-5 text-xs md:text-sm leading-relaxed shadow-md space-y-3.5 max-w-2xl mr-auto">
      {/* Clinical Disclaimer / Safety Badge */}
      {hasMedicalAlert && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <p>
            <strong>Aviso de Seguridad:</strong> Si experimentas dolor agudo persistente, mareos intensos o molestias en el pecho, detén la actividad y busca valoración médica profesional.
          </p>
        </div>
      )}

      {/* Main Text Content */}
      <div 
        className="prose prose-sm dark:prose-invert max-w-none space-y-2 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />

      {/* Emotional Needs Menu (Valky Guardian) */}
      {isEmotionalFatigue && (
        <div className="pt-2 border-t border-border/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <HeartHandshake className="h-3.5 w-3.5 text-rose-400" /> ¿Qué necesitas de Valky ahora mismo?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectEmotionalNeed('just_listen')}
              className="p-2.5 rounded-xl bg-background/80 hover:bg-primary/10 border border-border/50 text-left transition-colors flex items-center gap-2 text-xs font-semibold text-foreground"
            >
              <span className="text-base">👂</span>
              <span className="text-[11px]">Solo escúchame</span>
            </button>
            <button
              onClick={() => handleSelectEmotionalNeed('reframe_perspective')}
              className="p-2.5 rounded-xl bg-background/80 hover:bg-primary/10 border border-border/50 text-left transition-colors flex items-center gap-2 text-xs font-semibold text-foreground"
            >
              <span className="text-base">🔄</span>
              <span className="text-[11px]">Verlo diferente</span>
            </button>
            <button
              onClick={() => handleSelectEmotionalNeed('actionable_step')}
              className="p-2.5 rounded-xl bg-background/80 hover:bg-primary/10 border border-border/50 text-left transition-colors flex items-center gap-2 text-xs font-semibold text-foreground"
            >
              <span className="text-base">🎯</span>
              <span className="text-[11px]">Paso práctico</span>
            </button>
          </div>
        </div>
      )}

      {/* Recovery Protocol Action Chips */}
      {isRecoveryAdvice && (
        <div className="pt-2 border-t border-border/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" /> Protocolo de Recuperación Valkyrie:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center flex flex-col items-center gap-1">
              <Droplets className="h-4 w-4 text-cyan-400" />
              <span className="text-[10px] font-bold">💧 Hidratación</span>
            </div>
            <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center flex flex-col items-center gap-1">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] font-bold">🚶 Paseo 15 min</span>
            </div>
            <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center flex flex-col items-center gap-1">
              <Utensils className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] font-bold">🍗 25g Proteína</span>
            </div>
            <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center flex flex-col items-center gap-1">
              <Moon className="h-4 w-4 text-purple-400" />
              <span className="text-[10px] font-bold">😴 Dormir 7-8h</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Follow-Up Pills */}
      {followUpPills.length > 0 && onQuickReply && (
        <div className="pt-2 border-t border-border/30 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Respuestas Rápidas Sugeridas:</span>
          <div className="flex flex-wrap gap-2">
            {followUpPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => onQuickReply(pill)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>{pill}</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
