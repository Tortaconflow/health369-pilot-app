
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
  output: {schema: AISuggestionsOutputSchema},
  model: 'googleai/gemini-pro',
  prompt: `Eres un asistente personalizado de salud y fitness. Tu tarea es generar una sugerencia de receta y una sugerencia de rutina basadas en los datos del usuario.

Datos del Usuario:
{{{userData}}}

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido que se ajuste al esquema de salida. No incluyas texto adicional ni formato markdown.`,
});

const aiSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSuggestionsFlow',
    inputSchema: AISuggestionsInputSchema,
    outputSchema: AISuggestionsOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output();

    if (!output) {
      throw new Error('El modelo de IA no devolvió una salida válida.');
    }
    
    // Genkit, when an output schema is defined, automatically parses the JSON.
    // The complex parsing logic is no longer needed.
    return output;
  }
);
