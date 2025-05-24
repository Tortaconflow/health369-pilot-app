
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
  } catch (error: any) { // Added :any to allow more flexible property access for logging
    console.error("Caught error in generateAISuggestions action. Details follow:");
    if (error) {
        console.error("Error Message:", error.message);
        console.error("Error Name:", error.name);
        console.error("Error Stack:", error.stack);
        console.error("Error Object (raw):", error);
        try {
            // Attempt to stringify, including non-enumerable properties if possible
            console.error("Error Object (stringified with all props):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        } catch (stringifyError) {
            console.error("Could not stringify error object with getOwnPropertyNames:", stringifyError);
            console.error("Error Object (stringified basic):", JSON.stringify(error));
        }
    } else {
        console.error("Caught error is null or undefined in generateAISuggestions action.");
    }

    let errorMessage = "Ocurrió un error desconocido al generar sugerencias de IA.";
    if (error && typeof error.message === 'string' && error.message.trim() !== '') {
      errorMessage = error.message;
    } else if (typeof error === 'string' && error.trim() !== '') {
      errorMessage = error;
    } else if (error) {
      try {
        const specificError = JSON.stringify(error, Object.getOwnPropertyNames(error));
        errorMessage = (specificError === '{}' || specificError === 'null') ? 'El objeto de error está vacío o no se pudo serializar completamente.' : specificError;
      } catch (e) {
        errorMessage = "El objeto de error no se pudo serializar, posiblemente debido a una referencia circular.";
      }
    }
    // Fallback if still empty
    if (errorMessage.trim() === '' || errorMessage === '{}' || errorMessage === 'null') {
        errorMessage = "Error de IA: No se pudo obtener una respuesta válida del modelo. Inténtalo de nuevo.";
    }
    return { success: false, error: errorMessage };
  }
}

