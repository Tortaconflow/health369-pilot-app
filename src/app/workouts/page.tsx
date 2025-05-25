
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutDisplay from "@/components/workouts/WorkoutDisplay";
import type { Workout, MachineInfo } from "@/types/domain";
import { Dumbbell, Home, Cog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MachineInfoCard from "@/components/workouts/MachineInfoCard";

// Mock data for workouts - replace with actual data fetching
const mockWorkouts: Workout[] = [
  {
    id: "gym_routine_001",
    name: "Enfoque Torso y Core (Gimnasio)",
    dayDescription: "Fuerza para la parte superior y estabilidad del core",
    estimatedTime: "~1h. 30 min.",
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

const mockMachineInfo: MachineInfo[] = [
  {
    id: "machine001",
    name: "Máquina de Press de Pecho",
    description: "Desarrolla la fuerza y el tamaño de los músculos pectorales, deltoides anteriores y tríceps. Permite un movimiento guiado y seguro.",
    imagePlaceholderUrl: "https://placehold.co/600x400.png",
    dataAiHint: "chest press machine",
    affectedMuscleGroups: ["Pectorales", "Hombros (frontal)", "Tríceps"],
    commonExercises: [{id: "ex_m001", name: "Press de pecho en máquina"}],
  },
  {
    id: "machine002",
    name: "Máquina de Jalón Dorsal (Lat Pulldown)",
    description: "Fortalece los músculos de la espalda, especialmente los dorsales anchos, bíceps y antebrazos. Ideal para mejorar la amplitud de la espalda.",
    imagePlaceholderUrl: "https://placehold.co/600x400.png",
    dataAiHint: "lat pulldown machine",
    affectedMuscleGroups: ["Dorsales", "Bíceps", "Espalda Media"],
     commonExercises: [{id: "ex_m002", name: "Jalón dorsal al pecho"}],
  },
  {
    id: "machine003",
    name: "Prensa de Piernas (Leg Press)",
    description: "Trabaja los cuádriceps, glúteos e isquiotibiales. Una alternativa a las sentadillas, especialmente útil para levantar grandes pesos con apoyo lumbar.",
    imagePlaceholderUrl: "https://placehold.co/600x400.png",
    dataAiHint: "leg press machine",
    affectedMuscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
     commonExercises: [{id: "ex_m003", name: "Prensa de piernas"}],
  },
];


export default function WorkoutsPage() {
  const gymWorkout = mockWorkouts.find(w => w.type === 'gym');
  const homeWorkout = mockWorkouts.find(w => w.type === 'home');

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold text-primary mb-1">
          Explora Entrenamientos y Guías
        </h1>
        <p className="text-lg text-muted-foreground">
          Encuentra rutinas para el gimnasio, para casa, y aprende sobre el equipamiento.
        </p>
      </header>

      <Tabs defaultValue="gym" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="gym"><Dumbbell className="mr-2 h-4 w-4" />Gimnasio</TabsTrigger>
          <TabsTrigger value="home"><Home className="mr-2 h-4 w-4" />En Casa</TabsTrigger>
          <TabsTrigger value="machines"><Cog className="mr-2 h-4 w-4" />Guía de Máquinas</TabsTrigger>
        </TabsList>

        <TabsContent value="gym">
          {gymWorkout ? (
            <WorkoutDisplay workout={gymWorkout} />
          ) : (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No hay entrenamientos de gimnasio disponibles.</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="home">
          {homeWorkout ? (
            <WorkoutDisplay workout={homeWorkout} />
          ) : (
             <Card><CardContent className="p-6 text-center text-muted-foreground">No hay rutinas para casa disponibles.</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="machines">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Guía de Máquinas de Gimnasio</CardTitle>
              <CardDescription>Aprende para qué sirve cada máquina y qué músculos trabaja.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockMachineInfo.length > 0 ? (
                mockMachineInfo.map(machine => <MachineInfoCard key={machine.id} machine={machine} />)
              ) : (
                <p className="text-muted-foreground text-center py-4">No hay información de máquinas disponible.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

