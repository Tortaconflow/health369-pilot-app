
'use server';

/**
 * @fileOverview An AI agent for generating personalized health and fitness suggestions.
 *
 * - generateAISuggestions - A function that generates personalized suggestions.
 * - AISuggestionsInput - The input type for the generateAISuggestions function.
 * - AISuggestionsOutput - The return type for the generateAISuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z, defineFlow, run} from 'genkit';

// ARQUITECTURA: Se convierte 'goal' de un string a un enum para estandarizar la entrada,
// reducir la ambigüedad y mejorar la fiabilidad de las sugerencias del modelo.
const AISuggestionsInputSchema = z.object({
  goal: z.enum(['perder_peso', 'ganar_musculo', 'mantener_forma', 'mejorar_resistencia'])
    .describe("El objetivo principal de fitness del usuario."),
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado'])
    .describe("Nivel de condición física del usuario."),
  recentActivities: z.array(z.string()).optional()
    .describe("Actividades o ejercicios realizados recientemente (ej. ['corrida de 5km', 'sesión de pesas'])."),
  preferredCuisines: z.array(z.string()).optional()
    .describe("Tipos de comida preferidos (ej. 'mediterránea', 'mexicana').")
});
export type AISuggestionsInput = z.infer<typeof AISuggestionsInputSchema>;

// MEJORA: Se enriquece la salida para que sea más útil y estructurada.
const AISuggestionsOutputSchema = z.object({
  recipeSuggestion: z.object({
    name: z.string().describe("Nombre de la receta sugerida."),
    description: z.string().describe("Breve descripción de por qué esta receta es adecuada para el usuario."),
    calories: z.number().optional().describe("Estimación de calorías por porción.")
  }).describe('Una sugerencia de receta personalizada.'),
  
  routineSuggestion: z.object({
    activity: z.string().describe("Tipo de actividad o ejercicio sugerido."),
    description: z.string().describe("Breve descripción de por qué esta actividad es beneficiosa."),
    duration: z.string().optional().describe("Duración sugerida para la actividad (ej. '30 minutos').")
  }).describe('Una sugerencia de rutina o actividad física personalizada.')
});
export type AISuggestionsOutput = z.infer<typeof AISuggestionsOutputSchema>;


export async function generateAISuggestions(
  input: AISuggestionsInput
): Promise<AISuggestionsOutput> {
  const validatedInput = AISuggestionsInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Entrada inválida para generateAISuggestions:', validatedInput.error.flatten());
    throw new Error('Los datos proporcionados para generar sugerencias son inválidos.');
  }

  try {
    return await run('aiSuggestionsFlow', () => aiSuggestionsFlow(validatedInput.data));
  } catch (error) {
    console.error('Error al ejecutar aiSuggestionsFlow:', error);
    throw new Error('No se pudieron generar sugerencias en este momento. Por favor, inténtalo más tarde.');
  }
}

const prompt = ai.definePrompt({
  name: 'aiSuggestionsPrompt',
  input: {schema: AISuggestionsInputSchema},
  output: {schema: AISuggestionsOutputSchema},
  prompt: `Eres un coach de salud y fitness proactivo y motivador. Tu tarea es generar una sugerencia de receta y una sugerencia de actividad física, personalizadas según los datos del usuario.

DATOS DEL USUARIO:
- Objetivo Principal: {{{goal}}} (Traduce este valor a un lenguaje natural en tu respuesta, ej. 'perder_peso' -> 'perder peso').
- Nivel de Fitness: {{{fitnessLevel}}}
{{#if recentActivities}}
- Actividades Recientes: {{#each recentActivities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if preferredCuisines}}
- Cocinas Preferidas: {{#each preferredCuisines}}{{{this}}}{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

INSTRUCCIONES:
1.  **Sugerencia de Receta:** Basado en el objetivo y las preferencias del usuario, sugiere una receta específica. Debe ser saludable y alineada con su meta.
2.  **Sugerencia de Actividad:** Basado en el objetivo y las actividades recientes, sugiere una actividad complementaria. Si el usuario ha hecho mucha fuerza, sugiere algo de cardio ligero o recuperación activa. Si ha estado inactivo, sugiere un punto de partida razonable.
3.  **SALIDA JSON ESTRICTA:** Tu respuesta debe ser únicamente un objeto JSON válido que se ajuste al esquema de salida. No incluyas texto adicional ni formato markdown.

Genera las sugerencias ahora.`,
});

const aiSuggestionsFlow = defineFlow(
  {
    name: 'aiSuggestionsFlow',
    inputSchema: AISuggestionsInputSchema,
    outputSchema: AISuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await run('invoke-suggestions-prompt', async () => {
        const llmResponse = await prompt(input);
        return llmResponse.output;
    });

    if (!output) {
      throw new Error('El modelo de IA no devolvió una salida válida.');
    }
    
    const parsedOutput = AISuggestionsOutputSchema.safeParse(output);
    if (!parsedOutput.success) {
      console.error("Fallo en la validación del esquema de salida.", {
        input: input,
        rawOutput: JSON.stringify(output, null, 2),
        errors: parsedOutput.error.flatten(),
      });
      throw new Error(`La salida del modelo de IA no se ajustó al esquema esperado.`);
    }

    return parsedOutput.data;
  }
);
