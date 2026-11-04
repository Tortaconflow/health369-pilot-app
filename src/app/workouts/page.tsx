"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Workout, MachineInfo } from "@/types/domain";
import { Dumbbell, Home, Cog, Play, Sparkles, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import LiveWorkoutTracker from "@/components/workouts/LiveWorkoutTracker";

// --- Mock Data ---
const mockWorkouts: Workout[] = [
  {
    id: "gym_routine_001",
    name: "Protocolo Valky: Torso, Brazos y Core",
    dayDescription: "Fuerza para la parte superior y estabilidad del core",
    estimatedTime: "~45 min.",
    targetAudience: "Nivel Intermedio / Avanzado",
    type: "gym",
    progress: 0,
    exercises: [
      { id: "ex001", name: "Press de Pecho en Banco con Mancuernas", sets: 4, reps: 10, weight: "22 kg", equipment: ["mancuernas"], imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Pectorales", "Tríceps"], dataAiHint: "dumbbell press", notes: "Controla 2 seg la bajada." },
      { id: "ex002", name: "Jalón Dorsal en Polea Alta", sets: 4, reps: 12, weight: "45 kg", equipment: ["polea alta"], imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Espalda", "Dorsales"], dataAiHint: "lat pulldown", notes: "Lleva los codos hacia abajo sin arquear espalda." },
      { id: "ex003", name: "Press Militar de Hombros", sets: 3, reps: 10, weight: "14 kg", equipment: ["mancuernas"], imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Hombros"], dataAiHint: "shoulder press", notes: "Empuja con fuerza vertical." },
      { id: "ex004", name: "Curl de Bíceps en Supinación", sets: 3, reps: 12, weight: "12 kg", equipment: ["mancuernas"], imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Bíceps"], dataAiHint: "bicep curl" },
      { id: "ex005", name: "Plancha Isométrica con Activación de Core", sets: 3, duration: "45s", imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Core"], dataAiHint: "plank" }
    ],
  },
  {
    id: "home_routine_001",
    name: "Circuito Valky Express en Casa (Sin Equipo)",
    dayDescription: "Activación Metabólica & Fuerza Corporal",
    estimatedTime: "~20 min.",
    targetAudience: "Principiantes & Todos los niveles",
    type: "home",
    progress: 0,
    exercises: [
      { id: "ex_h001", name: "Sentadillas con Peso Corporal", sets: 4, reps: 15, imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Piernas", "Glúteos"], dataAiHint: "bodyweight squats", notes: "Rango profundo y talones firmes." },
      { id: "ex_h002", name: "Flexiones de Brazos (Push-ups)", sets: 3, reps: "10-12", notes: "Apoyar rodillas si es necesario.", imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Pectorales", "Tríceps"], dataAiHint: "push ups" },
      { id: "ex_h003", name: "Puente de Glúteos en el Suelo", sets: 3, reps: 15, imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Glúteos", "Isquiotibiales"], dataAiHint: "glute bridge" },
      { id: "ex_h004", name: "Escaladores (Mountain Climbers)", sets: 3, duration: "30s", imagePlaceholderUrl: "https://placehold.co/80x80.png", muscleGroups: ["Cardio", "Core"], dataAiHint: "mountain climbers" }
    ],
  },
];

const mockMachineInfo: MachineInfo[] = [
  { id: "machine001", name: "Máquina de Press de Pecho", description: "Desarrolla la fuerza y el tamaño de los músculos pectorales, deltoides anteriores y tríceps. Permite un movimiento guiado y seguro.", imagePlaceholderUrl: "https://placehold.co/600x400.png", dataAiHint: "chest press machine", affectedMuscleGroups: ["Pectorales", "Hombros (frontal)", "Tríceps"], commonExercises: [{id: "ex_m001", name: "Press de pecho en máquina"}], },
  { id: "machine002", name: "Máquina de Jalón Dorsal (Lat Pulldown)", description: "Fortalece los músculos de la espalda, especialmente los dorsales anchos, bíceps y antebrazos. Ideal para mejorar la amplitud de la espalda.", imagePlaceholderUrl: "https://placehold.co/600x400.png", dataAiHint: "lat pulldown machine", affectedMuscleGroups: ["Dorsales", "Bíceps", "Espalda Media"], commonExercises: [{id: "ex_m002", name: "Jalón dorsal al pecho"}], },
  { id: "machine003", name: "Prensa de Piernas (Leg Press)", description: "Trabaja los cuádriceps, glúteos e isquiotibiales. Una alternativa a las sentadillas, especialmente útil para levantar grandes pesos con apoyo lumbar.", imagePlaceholderUrl: "https://placehold.co/600x400.png", dataAiHint: "leg press machine", affectedMuscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"], commonExercises: [{id: "ex_m003", name: "Prensa de piernas"}], },
];

// Lazy load components
const WorkoutDisplay = dynamic(() => import('@/components/workouts/WorkoutDisplay'), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
});
const MachineInfoCard = dynamic(() => import('@/components/workouts/MachineInfoCard'), {
  loading: () => <Skeleton className="h-48 w-full" />,
});

export default function WorkoutsPage() {
  const [activeLiveWorkout, setActiveLiveWorkout] = useState<Workout | null>(null);

  const gymWorkout = mockWorkouts.find(w => w.type === 'gym') || mockWorkouts[0];
  const homeWorkout = mockWorkouts.find(w => w.type === 'home') || mockWorkouts[1];

  if (activeLiveWorkout) {
    return (
      <div className="container mx-auto py-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveLiveWorkout(null)} className="text-xs font-bold border-border/50">
            ← Salir del Modo en Vivo
          </Button>
          <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            ⚡ Modo Entrenamiento Activo
          </span>
        </div>
        <LiveWorkoutTracker workout={activeLiveWorkout} onFinish={() => setActiveLiveWorkout(null)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl" suppressHydrationWarning>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full mb-2 inline-block">
            MISIONES & ENTRENAMIENTOS VALKY 369
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Biblioteca & Modo en Vivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Ejecuta rutinas estructuradas, usa el temporizador de descanso y sube los atributos de tu superhéroe.
          </p>
        </div>

        <Button
          onClick={() => setActiveLiveWorkout(gymWorkout)}
          className="bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black px-6 py-6 rounded-xl shadow-lg gap-2 text-sm"
        >
          <Play className="h-4 w-4 fill-current" /> Iniciar Sesión en Vivo (+250 XP)
        </Button>
      </div>

      <Tabs defaultValue="gym" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-card/80 border border-border/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="gym" className="gap-2 font-bold text-xs">
            <Dumbbell className="h-4 w-4 text-rose-400" /> Gimnasio
          </TabsTrigger>
          <TabsTrigger value="home" className="gap-2 font-bold text-xs">
            <Home className="h-4 w-4 text-emerald-400" /> En Casa
          </TabsTrigger>
          <TabsTrigger value="machines" className="gap-2 font-bold text-xs">
            <Cog className="h-4 w-4 text-cyan-400" /> Máquinas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-xl bg-card border border-border/40">
            <div>
              <h3 className="font-extrabold text-base text-foreground">{gymWorkout.name}</h3>
              <p className="text-xs text-muted-foreground">{gymWorkout.dayDescription} • {gymWorkout.estimatedTime}</p>
            </div>
            <Button onClick={() => setActiveLiveWorkout(gymWorkout)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs">
              <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Entrenar Ahora
            </Button>
          </div>
          <WorkoutDisplay workout={gymWorkout} />
        </TabsContent>

        <TabsContent value="home" className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-xl bg-card border border-border/40">
            <div>
              <h3 className="font-extrabold text-base text-foreground">{homeWorkout.name}</h3>
              <p className="text-xs text-muted-foreground">{homeWorkout.dayDescription} • {homeWorkout.estimatedTime}</p>
            </div>
            <Button onClick={() => setActiveLiveWorkout(homeWorkout)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
              <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Entrenar en Casa
            </Button>
          </div>
          <WorkoutDisplay workout={homeWorkout} />
        </TabsContent>

        <TabsContent value="machines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockMachineInfo.map((machine) => (
              <MachineInfoCard key={machine.id} machine={machine} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
