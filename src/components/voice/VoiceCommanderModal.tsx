"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Sparkles, AlertCircle, Dumbbell, Clock, ArrowRight, Activity, ShieldAlert, Check } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { VoiceIntentParser } from "@/ai/voice/voice-intent-parser";
import { ExtractedVoiceEntity } from "@/types/companion";
import { useToast } from "@/hooks/use-toast";

interface VoiceCommanderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecuteCommand: (parsed: ExtractedVoiceEntity) => void;
}

export function VoiceCommanderModal({
  open,
  onOpenChange,
  onExecuteCommand,
}: VoiceCommanderModalProps) {
  const { toast } = useToast();
  const [manualInput, setManualInput] = useState("");

  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    onResult: (finalText) => {
      if (finalText) {
        handleProcessAndExecute(finalText);
      }
    },
  });

  // Auto-start listening when modal opens
  useEffect(() => {
    if (open) {
      resetTranscript();
      setManualInput("");
      startListening();
    } else {
      stopListening();
    }
  }, [open]);

  const handleProcessAndExecute = (commandText: string) => {
    const parsed = VoiceIntentParser.parseWorkoutCommand(commandText);
    onExecuteCommand(parsed);
    onOpenChange(false);
  };

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessAndExecute(manualInput.trim());
  };

  const quickVoiceChips = [
    { label: "🏋️ 80 kg × 8 reps", command: "80 por 8" },
    { label: "🏋️ 60 kg × 10 reps", command: "60 por 10" },
    { label: "⏱️ Descanso 60 seg", command: "Descanso 60 segundos" },
    { label: "⏱️ Descanso 90 seg", command: "Descanso 90 segundos" },
    { label: "➡️ Siguiente Ejercicio", command: "Siguiente ejercicio" },
    { label: "🩹 Molestia en hombro", command: "Me molestó el hombro" },
    { label: "🏆 Terminar Entrenamiento", command: "Terminé el entrenamiento" },
  ];

  const currentDisplaySpeech = transcript + (interimTranscript ? ` ${interimTranscript}` : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card/95 backdrop-blur-md border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs font-black uppercase tracking-wider gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Valky Voice • Control Manos Libres
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black text-foreground">
            Control de Entrenamiento por Voz
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Habla al micrófono o toca un comando rápido para registrar series sin tocar la pantalla.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Main Pulsing Mic Arena */}
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 text-center space-y-3 flex flex-col items-center justify-center">
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`h-20 w-20 rounded-full shadow-2xl transition-all ${
                isListening
                  ? "bg-rose-500 hover:bg-rose-600 text-white ring-8 ring-rose-500/30 animate-pulse scale-105"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>

            <div>
              <span className="text-sm font-black text-foreground block">
                {isListening ? "🔴 Escuchando... Di tu comando" : "Micrófono en pausa. Haz clic para activar"}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                Ejemplos: <em>"80 por 8"</em>, <em>"descanso 90s"</em>, <em>"siguiente"</em>
              </span>
            </div>

            {/* Live speech preview */}
            {currentDisplaySpeech && (
              <div className="w-full p-3 rounded-xl bg-background/90 border border-border/60 text-xs font-bold text-amber-400">
                "{currentDisplaySpeech}"
              </div>
            )}

            {speechError && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}
          </div>

          {/* Quick Voice Simulation Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Comandos Rápidos (1 Tap):
            </span>
            <div className="flex flex-wrap gap-2">
              {quickVoiceChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessAndExecute(chip.command)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-background hover:bg-primary/15 hover:border-primary/50 text-foreground border border-border/60 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Text Fallback */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pt-2 border-t border-border/20">
            <Input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="O escribe el comando (ej: '80 por 8')..."
              className="text-xs h-9 bg-background/80 border-border/60 rounded-xl"
            />
            <Button type="submit" size="sm" className="h-9 font-bold bg-primary text-primary-foreground rounded-xl">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
