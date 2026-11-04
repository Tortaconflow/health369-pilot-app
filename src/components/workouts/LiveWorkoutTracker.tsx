"use client";

import { useState, useEffect, useRef } from "react";
import { Workout, Exercise } from "@/types/domain";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Flame, Zap, Trophy, Clock, Dumbbell, Sparkles, ChevronRight, ArrowRight, Shield, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HeroService } from "@/services/heroService";
import { VoiceIntentParser } from "@/ai/voice/voice-intent-parser";
import { ValkyDebriefModal } from "@/components/workouts/ValkyDebriefModal";
import { VoiceCommanderModal } from "@/components/voice/VoiceCommanderModal";
import { ExtractedVoiceEntity } from "@/types/companion";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AudioWaveform } from "@/components/voice/AudioWaveform";
import Link from "next/link";

interface LiveWorkoutTrackerProps {
  workout: Workout;
  onFinish?: () => void;
}

interface SetLog {
  weight: number;
  reps: number;
  completed: boolean;
}

export default function LiveWorkoutTracker({ workout, onFinish }: LiveWorkoutTrackerProps) {
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [initialTime, setInitialTime] = useState(60);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [showVoiceCommanderModal, setShowVoiceCommanderModal] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>("");

  // Sets state per exercise: { [exerciseId]: SetLog[] }
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLog[]>>(() => {
    const initial: Record<string, SetLog[]> = {};
    workout.exercises.forEach((ex) => {
      const targetSets = typeof ex.sets === 'number' ? ex.sets : 3;
      const defaultWeight = ex.weight ? parseFloat(ex.weight.replace(/[^0-9.]/g, '')) || 20 : 0;
      const defaultReps = typeof ex.reps === 'number' ? ex.reps : 10;
      initial[ex.id] = Array.from({ length: targetSets }).map(() => ({
        weight: defaultWeight,
        reps: defaultReps,
        completed: false,
      }));
    });
    return initial;
  });

  const currentExercise = workout.exercises[currentExerciseIndex] || workout.exercises[0];
  const currentSets = exerciseLogs[currentExercise.id] || [];

  const handleExecuteVoiceEntity = (parsed: ExtractedVoiceEntity) => {
    setLastVoiceCommand(parsed.data.rawText);

    switch (parsed.intent) {
      case 'LOG_SET': {
        const nextIncompleteIndex = currentSets.findIndex(s => !s.completed);
        const targetIndex = nextIncompleteIndex !== -1 ? nextIncompleteIndex : currentSets.length - 1;
        if (targetIndex >= 0) {
          if (parsed.data.weightKg) handleUpdateSet(targetIndex, 'weight', parsed.data.weightKg);
          if (parsed.data.reps) handleUpdateSet(targetIndex, 'reps', parsed.data.reps);
          handleToggleSet(targetIndex);
          toast({
            title: `🎙️ Voz: Serie #${targetIndex + 1} Registrada (+15 XP)`,
            description: `${parsed.data.weightKg || currentSets[targetIndex]?.weight || 0}kg × ${parsed.data.reps || currentSets[targetIndex]?.reps || 10} reps`,
            className: "bg-emerald-600 text-white font-bold",
          });
        }
        break;
      }
      case 'NEXT_EXERCISE':
        if (currentExerciseIndex < workout.exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          toast({ title: "🎙️ Voz: Siguiente Ejercicio" });
        }
        break;
      case 'PREVIOUS_EXERCISE':
        if (currentExerciseIndex > 0) {
          setCurrentExerciseIndex(prev => prev - 1);
          toast({ title: "🎙️ Voz: Ejercicio Anterior" });
        }
        break;
      case 'START_REST':
        startRestTimer(parsed.data.restSeconds || 60);
        toast({ title: `🎙️ Voz: Descanso de ${parsed.data.restSeconds || 60}s Iniciado` });
        break;
      case 'REPORT_PAIN':
        toast({
          title: `🩹 Molestia Registrada: ${parsed.data.bodyPart || 'Articulación'}`,
          description: "Adaptando la intensidad y reduciendo sobrecarga para las siguientes series.",
          className: "bg-amber-600 text-white font-bold",
        });
        break;
      case 'COMPLETE_WORKOUT':
        setShowDebriefModal(true);
        break;
      default:
        toast({
          title: "Comando de Voz Recibido",
          description: `"${parsed.data.rawText}"`,
        });
    }
  };

  // Rest Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast({
        title: "⏰ ¡Descanso Terminado!",
        description: "A por la siguiente serie. ¡Mantén la concentración de superhéroe!",
        className: "bg-emerald-600 text-white font-bold",
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, toast]);

  const startRestTimer = (seconds: number = 60) => {
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleUpdateSet = (setIndex: number, field: 'weight' | 'reps', value: number) => {
    setExerciseLogs((prev) => {
      const updated = [...(prev[currentExercise.id] || [])];
      if (updated[setIndex]) {
        updated[setIndex] = { ...updated[setIndex], [field]: value };
      }
      return { ...prev, [currentExercise.id]: updated };
    });
  };

  const handleToggleSet = (setIndex: number) => {
    const targetSet = currentSets[setIndex];
    if (!targetSet) return;

    const nextState = !targetSet.completed;
    setExerciseLogs((prev) => {
      const updated = [...(prev[currentExercise.id] || [])];
      if (updated[setIndex]) {
        updated[setIndex] = { ...updated[setIndex], completed: nextState };
      }
      return { ...prev, [currentExercise.id]: updated };
    });

    if (nextState) {
      HeroService.awardAction('set_completed');
      startRestTimer(60);

      // Auto advance to next exercise if all sets completed
      const allOtherDone = currentSets.every((s, i) => (i === setIndex ? true : s.completed));
      if (allOtherDone && currentExerciseIndex < workout.exercises.length - 1) {
        setTimeout(() => {
          setCurrentExerciseIndex((prev) => prev + 1);
        }, 1200);
      }
    }
  };

  // Calculate Total Volume
  const totalVolumeKg = Object.values(exerciseLogs).reduce((total, sets) => {
    return total + sets.filter(s => s.completed).reduce((setTotal, s) => setTotal + (s.weight * s.reps), 0);
  }, 0);

  const completedSetsTotal = Object.values(exerciseLogs).reduce((total, sets) => {
    return total + sets.filter(s => s.completed).length;
  }, 0);

  const allSetsTotal = Object.values(exerciseLogs).reduce((total, sets) => total + sets.length, 0);
  const overallProgress = allSetsTotal > 0 ? Math.round((completedSetsTotal / allSetsTotal) * 100) : 0;

  const handleTriggerFinalize = () => {
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    setDurationMinutes(elapsedMinutes);
    setShowDebriefModal(true);
  };

  const handleDebriefConfirmed = () => {
    setWorkoutFinished(true);
    if (onFinish) onFinish();
  };

  if (workoutFinished) {
    return (
      <Card className="border-border/60 shadow-2xl bg-gradient-to-br from-card via-card to-amber-950/20 text-center p-8 space-y-6 max-w-2xl mx-auto">
        <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 w-fit mx-auto ring-4 ring-amber-500/30">
          <Trophy className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-amber-400 tracking-wider">MISIÓN HEROICA CUMPLIDA</span>
          <h2 className="text-3xl font-black text-foreground">¡Entrenamiento & Debrief Completados!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Completaste <strong>{workout.name}</strong>. Tu superhéroe se está haciendo más fuerte.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-background/80 border border-border/40 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-400">XP Ganado</span>
            <p className="text-xl font-black text-foreground">+300 XP</p>
          </div>
          <div className="p-3 rounded-xl bg-background/80 border border-border/40 text-center">
            <span className="text-[10px] uppercase font-bold text-rose-400">Volumen Total</span>
            <p className="text-xl font-black text-rose-400">{totalVolumeKg.toLocaleString()} kg</p>
          </div>
          <div className="p-3 rounded-xl bg-background/80 border border-border/40 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Duración</span>
            <p className="text-xl font-black text-emerald-400">{durationMinutes} min</p>
          </div>
          <div className="p-3 rounded-xl bg-background/80 border border-border/40 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-400">Atributos</span>
            <p className="text-xl font-black text-purple-400">+6 STR</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/profile" passHref>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 py-5 text-sm rounded-xl gap-1.5">
              Ver Evolución en Hero HQ <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setWorkoutFinished(false)} className="text-xs font-bold border-border/60">
            Volver a la Biblioteca
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Status & Hands-free Voice Bar */}
      <Card className="border-border/60 shadow-lg bg-card/90">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold">
            <span className="text-muted-foreground">
              Progreso ({completedSetsTotal}/{allSetsTotal} series) • Volumen: <strong className="text-rose-400">{totalVolumeKg.toLocaleString()} kg</strong>
            </span>

            {/* Hands-free Voice Button */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowVoiceCommanderModal(true)}
                className="text-xs font-bold gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 shadow-sm transition-all"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>🎙️ Manos Libres (Voz)</span>
              </Button>
              <span className="text-primary font-black">{overallProgress}%</span>
            </div>
          </div>
          {lastVoiceCommand && (
            <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              🎙️ Último comando reconocido: "{lastVoiceCommand}"
            </div>
          )}
          <Progress value={overallProgress} className="h-2 bg-muted" />
        </CardContent>
      </Card>

      {/* Main Active Exercise Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Exercise & Sets Table */}
        <Card className="lg:col-span-2 border-border/60 shadow-xl overflow-hidden bg-card">
          <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />
          
          <CardHeader className="pb-4 border-b border-border/20">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/10 text-primary border-primary/30 text-xs font-bold">
                Ejercicio {currentExerciseIndex + 1} de {workout.exercises.length}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Dumbbell className="h-4 w-4 text-primary" /> {currentExercise.muscleGroups?.join(', ')}
              </div>
            </div>
            <CardTitle className="text-2xl font-black text-foreground mt-1">
              {currentExercise.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {currentExercise.notes || "Controla el tempo del movimiento en la fase excéntrica."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Interactive Sets Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground text-left">
                    <th className="pb-2 font-bold uppercase tracking-wider">Serie</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Peso (kg)</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Repeticiones</th>
                    <th className="pb-2 font-bold uppercase tracking-wider text-right">Completar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {currentSets.map((s, idx) => (
                    <tr key={idx} className={s.completed ? "bg-emerald-500/5" : ""}>
                      <td className="py-3 font-bold text-foreground">
                        #{idx + 1}
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          value={s.weight || ''}
                          placeholder="kg"
                          onChange={(e) => handleUpdateSet(idx, 'weight', parseFloat(e.target.value) || 0)}
                          className="h-8 w-20 bg-background text-xs font-bold text-rose-400 border-border/60"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          value={s.reps || ''}
                          placeholder="reps"
                          onChange={(e) => handleUpdateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                          className="h-8 w-20 bg-background text-xs font-bold text-amber-400 border-border/60"
                        />
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleToggleSet(idx)}
                          className={`h-8 text-xs font-bold gap-1.5 transition-all ${
                            s.completed
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                              : "bg-muted/80 hover:bg-primary/20 text-foreground border border-border/50"
                          }`}
                        >
                          {s.completed ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" /> Hecho
                            </>
                          ) : (
                            <>
                              <Circle className="h-4 w-4" /> Registrar
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>

          <CardFooter className="p-6 border-t border-border/30 bg-muted/20 flex flex-col sm:flex-row gap-3 justify-between">
            {currentExerciseIndex > 0 ? (
              <Button
                variant="outline"
                onClick={() => setCurrentExerciseIndex((prev) => prev - 1)}
                className="w-full sm:w-auto font-bold border-border/60 text-xs"
              >
                ← Anterior
              </Button>
            ) : <div />}

            {currentExerciseIndex < workout.exercises.length - 1 ? (
              <Button
                variant="outline"
                onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
                className="w-full sm:w-auto font-bold border-border/60 text-xs gap-1"
              >
                Siguiente Ejercicio <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleTriggerFinalize}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow-lg"
              >
                <Trophy className="h-4 w-4 mr-1.5" /> Finalizar y Abrir Debrief (+300 XP)
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Right Col: Rest Timer */}
        <Card className="border-border/60 shadow-xl bg-card flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <CardTitle className="text-lg font-bold">Temporizador de Descanso</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Optimiza la recuperación entre series.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-4 border-muted bg-muted/20 shadow-inner">
              <span className="text-4xl font-black tracking-tight text-foreground">
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
              </span>
            </div>

            <div className="flex gap-2">
              {[30, 60, 90, 120].map((sec) => (
                <Button
                  key={sec}
                  size="sm"
                  variant="outline"
                  onClick={() => startRestTimer(sec)}
                  className="text-xs font-bold border-border/50 hover:bg-primary/10"
                >
                  {sec}s
                </Button>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-border/20 bg-muted/20 flex gap-2">
            <Button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="flex-1 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isTimerRunning ? "Pausar" : "Iniciar"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(initialTime);
              }}
              className="h-9 w-9 border-border/50"
              title="Reiniciar"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Valky Voice Commander Modal */}
      <VoiceCommanderModal
        open={showVoiceCommanderModal}
        onOpenChange={setShowVoiceCommanderModal}
        onExecuteCommand={handleExecuteVoiceEntity}
      />

      {/* Valky Debrief Modal */}
      <ValkyDebriefModal
        open={showDebriefModal}
        onOpenChange={setShowDebriefModal}
        workoutName={workout.name}
        totalVolumeKg={totalVolumeKg}
        onCompletedDebrief={handleDebriefConfirmed}
      />
    </div>
  );
}
