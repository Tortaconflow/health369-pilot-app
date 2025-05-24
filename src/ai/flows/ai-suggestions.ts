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
  prompt: `You are a personalized health and fitness assistant. Based on the user data provided, generate a personalized recipe suggestion and a personalized routine suggestion to help the user achieve their goals.

User Data: {{{userData}}}

Recipe Suggestion:
Routine Suggestion:`,
});

const aiSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSuggestionsFlow',
    inputSchema: AISuggestionsInputSchema,
    outputSchema: AISuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
