
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
  } catch (error: any) {
    console.error("Caught error in generateAISuggestions action. Details follow:");
    let errorMessage = "Ocurrió un error desconocido al generar sugerencias de IA.";

    if (error) {
        console.error("Error Message:", error.message);
        console.error("Error Name:", error.name);
        console.error("Error Stack (partial):", error.stack ? String(error.stack).substring(0, 500) : "N/A");
        console.error("Error Object (raw):", error);
        
        try {
            const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
            console.error("Error Object (stringified with all props):", errorString);
            if (errorString !== '{}' && errorString !== 'null') {
                 // Prefer specific message from parsed error if available
            }
        } catch (stringifyError) {
            console.error("Could not stringify error object with getOwnPropertyNames:", stringifyError);
            try {
                const basicStringify = JSON.stringify(error);
                console.error("Error Object (stringified basic):", basicStringify);
            } catch (basicStringifyError) {
                console.error("Could not perform basic stringify on error object:", basicStringifyError);
            }
        }
        
        // Construct user-facing error message
        if (typeof error.message === 'string' && error.message.trim() !== '') {
            errorMessage = error.message;
        } else if (typeof error === 'string' && error.trim() !== '') {
            errorMessage = error;
        } else {
            // Fallback if message is not directly available or useful
            errorMessage = "El modelo de IA no pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.";
        }

    } else {
        console.error("Caught error is null or undefined in generateAISuggestions action.");
        errorMessage = "Se recibió un error nulo o indefinido del servicio de IA.";
    }
    
    // Ensure errorMessage is never empty for the user
    if (errorMessage.trim() === '' || errorMessage === '{}' || errorMessage === 'null') {
        errorMessage = "Error de IA: No se pudo obtener una respuesta válida del modelo. Inténtalo de nuevo.";
    }

    return { success: false, error: errorMessage };
  }
}
