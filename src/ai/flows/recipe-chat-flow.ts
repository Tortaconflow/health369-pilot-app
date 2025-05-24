'use server';
/**
 * @fileOverview Un agente de IA para chatear sobre recetas y cocina.
 *
 * - chatAboutRecipes - Una función que maneja las conversaciones sobre recetas.
 * - RecipeChatInput - El tipo de entrada para la función chatAboutRecipes.
 * - RecipeChatOutput - El tipo de retorno para la función chatAboutRecipes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeChatInputSchema = z.object({
  userQuery: z.string().describe('La pregunta o mensaje del usuario sobre recetas o cocina.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('Historial de la conversación previa para mantener el contexto.'),
});
export type RecipeChatInput = z.infer<typeof RecipeChatInputSchema>;

const RecipeChatOutputSchema = z.object({
  aiResponse: z.string().describe('La respuesta del asistente de IA con sugerencias de recetas, instrucciones, etc.'),
});
export type RecipeChatOutput = z.infer<typeof RecipeChatOutputSchema>;

export async function chatAboutRecipes(input: RecipeChatInput): Promise<RecipeChatOutput> {
  return recipeChatFlow(input);
}

const recipeChatPrompt = ai.definePrompt({
  name: 'recipeChatPrompt',
  input: {schema: RecipeChatInputSchema},
  output: {schema: RecipeChatOutputSchema},
  prompt: `Eres "NutriChef AI", un asistente virtual experto en nutrición y cocina para la aplicación Health369. Tu especialidad es ayudar a los usuarios a encontrar y preparar comidas saludables y deliciosas.

Debes responder de forma amigable, clara y concisa. Proporciona recetas, listas de ingredientes, pasos de preparación, y consejos de cocina cuando se te solicite.

Historial de la conversación (si existe):
{{#if chatHistory}}
{{#each chatHistory}}
{{role}}: {{{content}}}
{{/each}}
{{/if}}

Consulta del Usuario:
{{{userQuery}}}

Respuesta de NutriChef AI:
(Proporciona aquí tu respuesta. Si das una receta, incluye ingredientes y pasos claros. Si es una pregunta general, responde de forma informativa.)
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
    // Construir el prompt con el historial
    let fullPromptContext = `Consulta del Usuario:\n${input.userQuery}`;
    if (input.chatHistory && input.chatHistory.length > 0) {
        const historyString = input.chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');
        fullPromptContext = `Historial de la conversación (si existe):\n${historyString}\n\nConsulta del Usuario:\n${input.userQuery}`;
    }

    const {output} = await recipeChatPrompt({
        userQuery: input.userQuery, // Mantener el input original para la plantilla
        chatHistory: input.chatHistory // Pasar el historial también
    });

    if (!output) {
      console.error('El modelo de IA no devolvió una salida para recipeChatFlow. Input:', input);
      throw new Error('NutriChef AI no pudo generar una respuesta en este momento.');
    }
    return output;
  }
);
