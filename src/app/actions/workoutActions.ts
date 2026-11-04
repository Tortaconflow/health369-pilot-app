"use server";

import {
  generatePersonalizedWorkout,
  type PersonalizedWorkoutInput,
  type PersonalizedWorkoutOutput,
} from "@/ai/flows/personalized-workout-flow";
import { z } from "zod";

const WorkoutActionSchema = z.object({
  userId: z.string().optional(),
  fitnessLevel: z.enum(["principiante", "intermedio", "avanzado"]).default("intermedio"),
  goals: z.array(z.string()).min(1).default(["mejorar condición física"]),
  timeAvailablePerSession: z.string().default("45 minutos"),
  daysPerWeek: z.coerce.number().min(1).max(7).default(3),
  limitations: z.array(z.string()).optional().default([]),
  preferredStyle: z
    .enum(["hit", "fuerza_resistencia", "mixto", "hipertrofia", "funcional"])
    .optional()
    .default("mixto"),
  availableEquipment: z.array(z.string()).optional().default(["mancuernas", "peso corporal"]),
  averageSleepHours: z.number().optional().default(7),
  restingHeartRate: z.number().optional(),
  recentActivitySummary: z.string().optional(),
  stressLevel: z.enum(["bajo", "medio", "alto"]).optional().default("medio"),
});

export type WorkoutActionInput = z.infer<typeof WorkoutActionSchema>;

export async function handleGenerateWorkoutAction(
  input: Partial<PersonalizedWorkoutInput>
): Promise<{ success: boolean; data?: PersonalizedWorkoutOutput; error?: string }> {
  try {
    const validation = WorkoutActionSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: JSON.stringify(validation.error.flatten().fieldErrors),
      };
    }

    const result = await generatePersonalizedWorkout(validation.data as PersonalizedWorkoutInput);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error en handleGenerateWorkoutAction:", error);
    return {
      success: false,
      error: error?.message || "No se pudo generar la rutina de entrenamiento personalizada.",
    };
  }
}
