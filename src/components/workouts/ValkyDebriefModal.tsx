"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw, Send } from "lucide-react";
import { VoiceIntentParser } from "@/ai/voice/voice-intent-parser";
import { ExtractedDebriefData } from "@/types/companion";
import { HeroService } from "@/services/heroService";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AudioWaveform } from "@/components/voice/AudioWaveform";

interface ValkyDebriefModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  totalVolumeKg: number;
  onCompletedDebrief?: (data: ExtractedDebriefData) => void;
}

export function ValkyDebriefModal({
  open,
  onOpenChange,
  workoutName,
  totalVolumeKg,
  onCompletedDebrief,
}: ValkyDebriefModalProps) {
  const { toast } = useToast();
  const [extractedData, setExtractedData] = useState<ExtractedDebriefData | null>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    audioLevel,
    startListening,
    stopListening,
    setTranscript,
    resetTranscript,
  } = useSpeechRecognition({
    onResult: (finalText) => {
      const parsed = VoiceIntentParser.parseDebriefAudioNarrative(finalText);
      setExtractedData(parsed);
    },
  });

  const fullDisplayTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : "");

  useEffect(() => {
    if (fullDisplayTranscript) {
      const parsed = VoiceIntentParser.parseDebriefAudioNarrative(fullDisplayTranscript);
      setExtractedData(parsed);
    }
  }, [fullDisplayTranscript]);

  const toggleRecording = async () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setExtractedData(null);
      await startListening();
      toast({
        title: "🎙️ Micrófono Abierto",
        description: "Valky te está escuchando. Habla libremente sobre tu entrenamiento.",
        className: "bg-primary text-primary-foreground font-bold",
      });
    }
  };

  const handleSimulateQuickDebrief = (text: string) => {
    setTranscript(text);
    const parsed = VoiceIntentParser.parseDebriefAudioNarrative(text);
    setExtractedData(parsed);
  };

  const handleConfirmAndSave = () => {
    const dataToSave = extractedData || VoiceIntentParser.parseDebriefAudioNarrative(fullDisplayTranscript || "Entrenamiento completado en buen estado.");
    
    // Award XP and adjust Hero recovery stats
    const { leveledUp } = HeroService.awardAction('workout_completed', {
      xp: 300,
      str: 6,
      end: 3,
      rec: dataToSave.reportedDiscomfort ? 1 : 4,
      message: `¡Valky Debrief Guardado (+300 XP)!`,
    });

    toast({
      title: leveledUp ? "🎉 ¡SUBISTE DE NIVEL CON ESTE DEBRIEF!" : "⚡ ¡Debrief Confirmado (+300 XP)!",
      description: "Tu esfuerzo y sensaciones han quedado registrados en tu perfil de superhéroe.",
      className: "bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black border-2 border-amber-300 shadow-2xl",
    });

    if (onCompletedDebrief) onCompletedDebrief(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card/95 backdrop-blur-md border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs font-black uppercase tracking-wider gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Valky Debrief • Audio Inteligente
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">
            Buen trabajo. Cuéntame cómo te fue hoy.
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Habla 15-30 segundos. Valky extraerá automáticamente tu percepción de esfuerzo, molestias y sugerencias de recuperación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Voice Capture Arena */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/40 text-center space-y-3">
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                type="button"
                onClick={toggleRecording}
                className={`h-16 w-16 rounded-full shadow-2xl transition-all ${
                  isListening
                    ? "bg-rose-500 hover:bg-rose-600 text-white ring-8 ring-rose-500/30 scale-105"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
              >
                {isListening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
              </Button>

              {/* Audio Wave Visualizer */}
              <AudioWaveform isListening={isListening} audioLevel={audioLevel} />
            </div>

            <div>
              <span className="text-xs font-bold text-foreground block">
                {isListening ? "🔴 Grabando voz... (Habla libremente al micrófono)" : "Presiona el micrófono para hablar"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                🔒 Audio Efímero: Se procesa en tu navegador y se destruye de inmediato.
              </span>
            </div>

            {speechError && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Quick Demo Templates */}
            {!fullDisplayTranscript && !isListening && (
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleSimulateQuickDebrief("Estuvo pesado el press, saqué 80 por 8 pero me molestó un poco el hombro y dormí 6 horas.")}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-background/80 hover:bg-primary/10 border border-border/50 transition-colors"
                >
                  💡 Probar ejemplo con molestia en hombro
                </button>
                <button
                  onClick={() => handleSimulateQuickDebrief("Sesión excelente, me sentí con mucha fuerza y sin ningún dolor.")}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-background/80 hover:bg-primary/10 border border-border/50 transition-colors"
                >
                  💡 Probar ejemplo sesión óptima
                </button>
              </div>
            )}
          </div>

          {/* Manual / Live Transcription Editor */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Tu reporte post-entrenamiento:</span>
            <div className="flex gap-2">
              <Input
                value={fullDisplayTranscript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Escribe o dicta: 'Estuvo pesado, 80 por 8 en press, dormí 6h'..."
                className="text-xs bg-background/90 border-border/60 rounded-xl"
              />
              {fullDisplayTranscript && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetTranscript}
                  className="text-xs font-bold shrink-0 rounded-xl border-border/60"
                  title="Limpiar"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Extracted Structured Results */}
          {extractedData && (
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Esto entendió Valky:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Dificultad (RPE)</span>
                  <p className="text-sm font-black text-amber-400">
                    {extractedData.perceivedDifficulty.toUpperCase()} (~{extractedData.rpeEstimated}/10)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Molestia</span>
                  <p className="text-sm font-black text-rose-400">
                    {extractedData.reportedDiscomfort || "Ninguna ✓"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Sueño Reportado</span>
                  <p className="text-sm font-black text-purple-400">
                    {extractedData.sleepHoursReported ? `${extractedData.sleepHoursReported} hrs` : "No especificado"}
                  </p>
                </div>
              </div>

              {/* Recovery Suggestion */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-foreground flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-400 block">Acción de Recuperación Recomendada:</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{extractedData.recommendedRecoveryAction}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/20 pt-3 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleConfirmAndSave}
            disabled={!fullDisplayTranscript && !extractedData}
            className="w-full sm:w-auto flex-1 font-black bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-lg text-xs py-5"
          >
            Confirmar y Guardar Debrief (+300 XP)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
