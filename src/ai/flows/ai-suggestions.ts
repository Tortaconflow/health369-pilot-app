
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
  prompt: `You are a personalized health and fitness assistant.
Based on the user data provided:
User Data: {{{userData}}}

Generate a personalized recipe suggestion and a personalized routine suggestion to help the user achieve their goals.
Your response MUST be a JSON object matching the following structure:
{
  "recipeSuggestion": "string (This should be a personalized recipe suggestion. Example: 'Ensalada de Quinoa con Pollo a la Parrilla: Mezcla quinoa cocida, pollo a la parrilla en cubos, pimientos picados, pepino y un aderezo ligero de limón y aceite de oliva.')",
  "routineSuggestion": "string (This should be a personalized routine suggestion. Example: 'Entrenamiento de Cuerpo Completo (30 min): 10 min de cardio ligero (trote), 3 series de 12 sentadillas, 3 series de 10 flexiones, 3 series de 15 planchas (30 seg cada una).')"
}

Ensure your output is a valid JSON object.`,
});

const aiSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSuggestionsFlow',
    inputSchema: AISuggestionsInputSchema,
    outputSchema: AISuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI model did not return an output matching the expected schema.');
    }
    return output;
  }
);

