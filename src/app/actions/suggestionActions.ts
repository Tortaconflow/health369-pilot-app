
"use server";

import { generateAISuggestions as callAISuggestionsFlow, type AISuggestionsInput, type AISuggestionsOutput } from '@/ai/flows/ai-suggestions';
import { z } from 'zod';

const SuggestionActionSchema = z.object({
  goal: z.enum(['perder_peso', 'ganar_musculo', 'mantener_forma', 'mejorar_resistencia']).default('mantener_forma'),
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado']).default('intermedio'),
  recentActivities: z.array(z.string()).optional().default([]),
  preferredCuisines: z.array(z.string()).optional().default([]),
});

export type SuggestionActionInput = z.infer<typeof SuggestionActionSchema>;

export async function generateAISuggestions(
  input: Partial<AISuggestionsInput> = {}
): Promise<{ success: boolean; data?: AISuggestionsOutput; error?: string }> {
  const validation = SuggestionActionSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    const result = await callAISuggestionsFlow(validation.data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in generateAISuggestions action:", error);
    return { success: false, error: error?.message || "Ocurrió un error al generar sugerencias de IA." };
  }
}

