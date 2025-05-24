"use server";

import { generateAISuggestions as callAISuggestionsFlow, type AISuggestionsInput, type AISuggestionsOutput } from '@/ai/flows/ai-suggestions';
import { z } from 'zod';

const GenerateAISuggestionsSchema = z.object({
  userData: z.string().min(10, "User data must be at least 10 characters long."),
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
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    let errorMessage = "Ocurrió un error desconocido al generar sugerencias de IA.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      try {
        // Attempt to stringify, but catch if it's circular or too complex
        const specificError = JSON.stringify(error);
        errorMessage = specificError === '{}' ? 'Error object could not be stringified or is empty.' : specificError;
      } catch (e) {
        errorMessage = "Error object could not be stringified.";
      }
    }
    return { success: false, error: errorMessage };
  }
}
