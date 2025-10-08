
'use server';
/**
 * @fileOverview Un agente de IA para chatear sobre recetas y cocina.
 * @description Este flujo se centra exclusivamente en la conversación sobre nutrición y recetas.
 *              La lógica para iniciar otros procesos (como la generación de rutinas) debe
 *              ser manejada por la lógica de negocio en el backend o frontend, no dentro de este prompt.
 *
 * - chatAboutRecipes - Una función que maneja las conversaciones sobre recetas.
 * - RecipeChatInput - El tipo de entrada para la función chatAboutRecipes.
 * - RecipeChatOutput - El tipo de retorno para la función chatAboutRecipes.
 */

import {ai} from '@/ai/genkit';
// CORRECCIÓN: Se importan 'z', 'defineFlow', y 'run' directamente desde 'genkit'.
import {z, defineFlow, run} from 'genkit';

const RecipeChatInputSchema = z.object({
  // MEJORA: Se separa el contexto del usuario de la consulta para un procesamiento más claro.
  userContext: z.object({
    goal: z.string().optional().describe("El objetivo principal de fitness del usuario, ej. 'ganar masa muscular'."),
    // Se pueden añadir más datos de contexto aquí si es necesario (ej. alergias, preferencias).
  }).optional().describe("Contexto sobre las preferencias y objetivos del usuario."),
  userQuery: z.string().describe('La pregunta o mensaje del usuario.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']), // MEJORA: Se usa 'model' en lugar de 'assistant' para alinearse con Genkit.
    content: z.string(),
  })).optional().describe('Historial de la conversación previa para mantener el contexto.'),
});
export type RecipeChatInput = z.infer<typeof RecipeChatInputSchema>;

const RecipeChatOutputSchema = z.object({
  aiResponse: z.string().describe('La respuesta del asistente de IA.'),
});
export type RecipeChatOutput = z.infer<typeof RecipeChatOutputSchema>;


export async function chatAboutRecipes(input: RecipeChatInput): Promise<RecipeChatOutput> {
  const validatedInput = RecipeChatInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Entrada inválida para chatAboutRecipes:', validatedInput.error.flatten());
    throw new Error('Los datos proporcionados para el chat son inválidos.');
  }

  try {
    return await run('recipeChatFlow', () => recipeChatFlow(validatedInput.data));
  } catch (error) {
    console.error('Error al ejecutar recipeChatFlow:', error);
    throw new Error('NutriChef AI no está disponible en este momento. Por favor, inténtalo más tarde.');
  }
}

const recipeChatPrompt = ai.definePrompt({
  name: 'recipeChatPrompt',
  input: {schema: RecipeChatInputSchema},
  output: {schema: RecipeChatOutputSchema},
  // MEJORA: Prompt simplificado y enfocado en una sola tarea: ser un chatbot de nutrición.
  prompt: `Eres "NutriChef AI", un coach de fitness y nutrición entusiasta y empático para la aplicación Health369. Tu tono es motivador y usas emojis ocasionalmente (💪, 🥗, 🚀).

REGLA DE ORO: Cada respuesta tuya debe terminar con una pregunta abierta para mantener la conversación fluida y natural.

TAREA PRINCIPAL:
Tu único objetivo es chatear con el usuario sobre recetas, nutrición y consejos de cocina.
- Proporciona recetas, listas de ingredientes y pasos de preparación.
- Da consejos sobre técnicas de cocina saludables.
- Responde preguntas sobre el valor nutricional de los alimentos.

PERSONALIZACIÓN:
{{#if userContext.goal}}
- Adapta tus sugerencias al objetivo del usuario: "{{userContext.goal}}". Por ejemplo, si el objetivo es "ganar masa muscular", sugiere recetas altas en proteínas. Si es "perder peso", sugiere opciones más ligeras y ricas en nutrientes.
{{/if}}

HISTORIAL DE CONVERSACIÓN:
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if_eq role "user"}}USER: {{{content}}}{{/if_eq}}
    {{#if_eq role "model"}}AI: {{{content}}}{{/if_eq}}
  {{/each}}
{{/if}}

PREGUNTA ACTUAL DEL USUARIO:
{{{userQuery}}}

Tu respuesta como NutriChef AI (recuerda terminar con una pregunta abierta):
`,
});

const recipeChatFlow = defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {

    const {output} = await run('invoke-recipe-chat-prompt', async () => {
        const llmResponse = await recipeChatPrompt(input);
        return llmResponse.output;
    });

    if (!output) {
      console.error('El modelo de IA no devolvió una salida para recipeChatFlow. Input:', input);
      throw new Error('NutriChef AI no pudo generar una respuesta en este momento.');
    }
    
    return output;
  }
);
