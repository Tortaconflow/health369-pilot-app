
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
El objeto JSON DEBE tener la siguiente estructura exacta:
{
  "recipeSuggestion": "string",
  "routineSuggestion": "string"
}

Ejemplo del resultado JSON exacto requerido:
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
    const {output} = await prompt(input);
    
    if (!output) {
      console.error('AI model did not return an output. Output was null or undefined. Input:', input);
      throw new Error('El modelo de IA no devolvió una salida. La salida fue nula o indefinida.');
    }
    
    // Genkit should have already parsed according to AISuggestionsOutputSchema due to its definition in ai.definePrompt.
    // This explicit parse is a safeguard or for cases where Genkit's parsing might be too lenient or the output object isn't directly the parsed data.
    const parsedOutput = AISuggestionsOutputSchema.safeParse(output);
    if (!parsedOutput.success) {
        console.error("AISuggestionsOutputSchema parsing failed in flow. Input:", input, "Raw Output:", output, "Zod Errors:", parsedOutput.error.flatten());
        throw new Error(`La salida del modelo de IA no se ajustó al esquema después del procesamiento de Genkit. Problemas: ${JSON.stringify(parsedOutput.error.flatten().fieldErrors)}`);
    }
    return parsedOutput.data;
  }
);

