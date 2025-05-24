
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutDisplay from "@/components/workouts/WorkoutDisplay";
import type { Workout } from "@/types/domain";
import { Dumbbell } from "lucide-react";

// Mock data for workouts - replace with actual data fetching
const mockWorkouts: Workout[] = [
  {
    id: "gym_routine_001",
    name: "Pectoral + Espalda + Glúteos",
    dayDescription: "1 día de entrenamiento",
    estimatedTime: "~1h. 42 min.",
    targetAudience: "para hombres y mujeres",
    type: "gym",
    progress: 0,
    exercises: [
      {
        id: "ex001",
        name: "Cinta de correr",
        duration: "5 min.",
        notes: "110-140lpm",
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Cardio"],
        dataAiHint: "treadmill running"
      },
      {
        id: "ex002",
        name: "Calentamiento de hombros con banda de resistencia",
        sets: 2,
        reps: 15,
        equipment: ["banda de resistencia"],
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Hombros"],
        dataAiHint: "shoulder warmup"
      },
      {
        id: "ex003",
        name: "Plancha lateral sobre el codo",
        sets: 4,
        duration: "30s",
        notes: "por lado",
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Core", "Oblicuos"],
        dataAiHint: "side plank"
      },
      {
        id: "ex004",
        name: "Press inclinado en máquina",
        sets: 4,
        reps: 12,
        weight: "22.5 kg",
        equipment: ["máquina de press inclinado"],
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Pectoral Superior"],
        dataAiHint: "incline press machine"
      },
      {
        id: "ex005",
        name: "Jalón de polea alta tras nuca con agarre amplio",
        sets: 4,
        reps: 12,
        weight: "40 kg",
        equipment: ["máquina de polea alta"],
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Espalda", "Dorsales"],
        dataAiHint: "lat pulldown"
      },
      {
        id: "ex006",
        name: "Press de pecho con mancuernas",
        sets: 4,
        reps: 10,
        weight: "20 kg",
        equipment: ["mancuernas"],
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Pectoral"],
        dataAiHint: "dumbbell press"
      },
    ],
  },
  {
    id: "home_routine_001",
    name: "Rutina Rápida en Casa",
    dayDescription: "Activación Matutina",
    estimatedTime: "~20 min.",
    targetAudience: "para todos los niveles",
    type: "home",
    progress: 25, // Example progress
    exercises: [
      {
        id: "ex_h001",
        name: "Saltos de Tijera (Jumping Jacks)",
        duration: "60s",
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Cardio", "Cuerpo Completo"],
        dataAiHint: "jumping jacks"
      },
      {
        id: "ex_h002",
        name: "Sentadillas con Peso Corporal",
        sets: 3,
        reps: 15,
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Piernas", "Glúteos"],
        dataAiHint: "bodyweight squats"
      },
      {
        id: "ex_h003",
        name: "Flexiones (Push-ups)",
        sets: 3,
        reps: "Máx.",
        notes: "Adaptar según nivel (rodillas o estándar)",
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Pectoral", "Hombros", "Tríceps"],
        dataAiHint: "push ups"
      },
      {
        id: "ex_h004",
        name: "Plancha Frontal (Plank)",
        sets: 3,
        duration: "30-60s",
        imagePlaceholderUrl: "https://placehold.co/80x80.png",
        muscleGroups: ["Core"],
        dataAiHint: "plank exercise"
      },
    ],
  },
];


export default function WorkoutsPage() {
  // For now, display the first mock workout.
  // Later, this could be selectable or based on user's current plan.
  const currentWorkout = mockWorkouts[0]; 
  // const homeWorkout = mockWorkouts[1];

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-primary mb-1">
          Entrenamiento Personalizado
        </h1>
        <p className="text-lg text-muted-foreground">
          {currentWorkout.targetAudience}
        </p>
      </header>

      {/* This could be a tab system in the future: Entrenamientos, Máquinas, Rutinas Casa */}
      <Button variant="default" size="lg" className="w-full md:w-auto mb-6 text-lg">
        <Dumbbell className="mr-2 h-5 w-5" />
        Entrenamientos
      </Button>
      
      {currentWorkout && <WorkoutDisplay workout={currentWorkout} />}
      
      {/* Example of showing another workout type */}
      {/* {homeWorkout && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Rutinas para Casa</h2>
          <WorkoutDisplay workout={homeWorkout} />
        </div>
      )} */}

      {/* TODO: Add sections for "Para qué sirve cada máquina" and more "Rutinas para casa" */}
      {/* These could be separate components or tabs within this page */}

    </div>
  );
}
