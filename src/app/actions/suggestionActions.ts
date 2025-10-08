
"use server";

import { generateAISuggestions as callAISuggestionsFlow, type AISuggestionsInput, type AISuggestionsOutput } from '@/ai/flows/ai-suggestions';
import { z } from 'zod';

const GenerateAISuggestionsSchema = z.object({
  userData: z.string().min(1, "User data cannot be empty."),
});

export async function generateAISuggestions(
  input: AISuggestionsInput
): Promise<{ success: boolean; data?: AISuggestionsOutput; error?: string }> {
  
  const validation = GenerateAISuggestionsSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    const result = await callAISuggestionsFlow(validation.data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in generateAISuggestions action:", error);
    return { success: false, error: error.message || "Ocurrió un error desconocido al generar sugerencias de IA." };
  }
}
