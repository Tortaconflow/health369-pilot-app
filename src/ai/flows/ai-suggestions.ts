
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
  output: {schema: AISuggestionsOutputSchema}, // Genkit uses this to guide the model
  prompt: `You are a personalized health and fitness assistant.
Your task is to generate a personalized recipe suggestion and a personalized routine suggestion based on the user data provided.

User Data:
{{{userData}}}

You MUST produce a single, valid JSON object as your response. Do NOT include any other text, explanations, or markdown formatting (like \`\`\`json) before or after the JSON object.
The JSON object MUST have the following structure:
{
  "recipeSuggestion": "string",
  "routineSuggestion": "string"
}

Example of the exact JSON output required:
{
  "recipeSuggestion": "Ensalada de Quinoa con Pollo a la Parrilla: Mezcla quinoa cocida, pollo a la parrilla en cubos, pimientos picados, pepino y un aderezo ligero de limón y aceite de oliva.",
  "routineSuggestion": "Entrenamiento de Cuerpo Completo (30 min): 10 min de cardio ligero (trote), 3 series de 12 sentadillas, 3 series de 10 flexiones, 3 series de 15 planchas (30 seg cada una)."
}

Ensure your entire response is ONLY this JSON object.
`,
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
      throw new Error('AI model did not return an output. Output was null or undefined.');
    }
    
    const parsedOutput = AISuggestionsOutputSchema.safeParse(output);
    if (!parsedOutput.success) {
        console.error("AISuggestionsOutputSchema parsing failed in flow:", parsedOutput.error.flatten());
        throw new Error(`AI model output did not conform to schema after Genkit processing. Issues: ${JSON.stringify(parsedOutput.error.flatten().fieldErrors)}`);
    }
    return parsedOutput.data;
  }
);

