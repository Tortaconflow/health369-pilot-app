
'use server';

/**
 * @fileOverview An AI agent for generating personalized health and fitness suggestions.
 *
 * - generateAISuggestions - A function that generates personalized suggestions.
 * - AISuggestionsInput - The input type for the generateAISuggestions function.
 * - AISuggestionsOutput - The return type for the generateAISuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestionsInputSchema = z.object({
  userData: z
    .string()
    .describe('User data including health goals, progress, and preferences.'),
});

export type AISuggestionsInput = z.infer<typeof AISuggestionsInputSchema>;

const AISuggestionsOutputSchema = z.object({
  recipeSuggestion: z.string().describe('A personalized recipe suggestion.'),
  routineSuggestion: z.string().describe('A personalized routine suggestion.'),
});

export type AISuggestionsOutput = z.infer<typeof AISuggestionsOutputSchema>;

export async function generateAISuggestions(
  input: AISuggestionsInput
): Promise<AISuggestionsOutput> {
  return aiSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestionsPrompt',
  input: {schema: AISuggestionsInputSchema},
  output: {schema: AISuggestionsOutputSchema}, // Genkit uses this to guide the model and parse its output
  prompt: `Eres un asistente personalizado de salud y fitness.
Tu tarea es generar una sugerencia de receta personalizada y una sugerencia de rutina personalizada basada en los datos del usuario proporcionados.

Datos del Usuario:
{{{userData}}}

IMPORTANTE: Debes producir ÚNICAMENTE un objeto JSON válido como respuesta. No incluyas ningún otro texto, explicaciones o formato markdown (como \`\`\`json) antes o después del objeto JSON.

El objeto JSON DEBE tener la siguiente estructura exacta y contener ejemplos de valores:
{
  "recipeSuggestion": "Ensalada de Quinoa con Pollo a la Parrilla: Mezcla quinoa cocida, pollo a la parrilla en cubos, pimientos picados, pepino y un aderezo ligero de limón y aceite de oliva.",
  "routineSuggestion": "Entrenamiento de Cuerpo Completo (30 min): 10 min de cardio ligero (trote), 3 series de 12 sentadillas, 3 series de 10 flexiones, 3 series de 15 planchas (30 seg cada una)."
}

Asegúrate de que TODA tu respuesta sea SOLAMENTE este objeto JSON.
`,
});

const aiSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSuggestionsFlow',
    inputSchema: AISuggestionsInputSchema,
    outputSchema: AISuggestionsOutputSchema,
  },
  async input => {
    let promptCallResult;
    try {
      promptCallResult = await prompt(input);
    } catch (e: any) {
      console.error('Error directly from prompt() call in aiSuggestionsFlow:', e);
      let message = 'Error al llamar al modelo de IA base para sugerencias.';
      if (e && e.message) {
        message += ` Detalles: ${e.message}`;
      }
      // Re-throw as a standard error to be caught by the action
      throw new Error(message);
    }

    const {output} = promptCallResult; // output is AISuggestionsOutput | undefined
    
    if (!output) {
      console.error('AI model did not return an output for aiSuggestionsFlow. Output was null or undefined. Input:', input);
      throw new Error('El modelo de IA no devolvió una salida (output fue nulo o indefinido).');
    }
    
    const parsedOutput = AISuggestionsOutputSchema.safeParse(output);
    if (!parsedOutput.success) {
        console.error("AISuggestionsOutputSchema parsing failed in aiSuggestionsFlow. Input:", input, "Raw Output:", JSON.stringify(output, null, 2), "Zod Errors:", parsedOutput.error.flatten());
        throw new Error(`La salida del modelo de IA no se ajustó al esquema después del procesamiento de Genkit. Problemas: ${JSON.stringify(parsedOutput.error.flatten().fieldErrors)}`);
    }
    return parsedOutput.data;
  }
);

