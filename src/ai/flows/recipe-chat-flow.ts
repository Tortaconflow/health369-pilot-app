'use server';

/**
 * @fileOverview Un agente de IA para chatear sobre fitness, recetas, hábitos y motivación de superhéroes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSmartValkyResponse } from '@/ai/valky-knowledge-engine';

const RecipeChatInputSchema = z.object({
  userContext: z.object({
    goal: z.string().optional().describe("El objetivo principal de fitness del usuario, ej. 'ganar masa muscular'."),
  }).optional().describe("Contexto sobre las preferencias y objetivos del usuario."),
  userQuery: z.string().describe('La pregunta o mensaje del usuario.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model', 'assistant']),
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
    // Attempt Genkit Gemini 2.0 Flow
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      return await recipeChatFlow(validatedInput.data);
    }
  } catch (error) {
    console.warn('Genkit online API no disponible, utilizando Valky Knowledge Engine:', error);
  }

  // Resilient Knowledge Engine Fallback (Garantiza 100% disponibilidad y respuestas empáticas)
  const localResponse = getSmartValkyResponse({
    userQuery: validatedInput.data.userQuery,
    goal: validatedInput.data.userContext?.goal,
  });

  return {
    aiResponse: localResponse,
  };
}

const recipeChatPrompt = ai.definePrompt({
  name: 'recipeChatPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: RecipeChatInputSchema},
  output: {schema: RecipeChatOutputSchema},
  prompt: `Eres "Valky AI Coach", un coach de fitness y nutrición de superhéroes entusiasta y empático para la aplicación Valky (inspirada en Valkiria). Tu tono es heroico, empático y motivador para principiantes. Usas emojis ocasionalmente (⚡, 💪, 🥗, 🛡️).

REGLA DE ORO: Cada respuesta tuya debe ser clara, comprensible para principiantes y terminar con una pregunta abierta para mantener la conversación fluida y natural.

TAREA PRINCIPAL:
Tu objetivo es acompañar al usuario en su camino fitness:
- Motivación en días difíciles y creación de hábitos sostenibles.
- Ideas de comidas y recetas saludables fáciles y accesibles.
- Consejos de técnica, recuperación y cómo empezar sin lesionarse.
- Explicar cómo subir sus atributos de superhéroe en Valky.

PERSONALIZACIÓN:
{{#if userContext.goal}}
- Adapta tus sugerencias al objetivo del usuario: "{{userContext.goal}}".
{{/if}}

HISTORIAL DE CONVERSACIÓN:
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if_eq role "user"}}USER: {{{content}}}{{/if_eq}}
    {{#if_eq role "model"}}AI: {{{content}}}{{/if_eq}}
    {{#if_eq role "assistant"}}AI: {{{content}}}{{/if_eq}}
  {{/each}}
{{/if}}

PREGUNTA ACTUAL DEL USUARIO:
{{{userQuery}}}

Tu respuesta como Valky AI Coach:
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
    const { output } = await recipeChatPrompt(input);
    if (!output) {
      throw new Error('Sin respuesta del modelo.');
    }
    return output;
  }
);
