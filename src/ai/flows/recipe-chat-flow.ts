
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

// Definimos un tipo para las preferencias del usuario que podrían venir en el contexto.
// Esto es solo para la lógica del prompt, el esquema de entrada principal sigue siendo RecipeChatInputSchema.
const UserPreferencesSchema = z.object({
  objective: z.string().optional().describe("El objetivo principal del usuario (ej. ganar masa muscular, perder peso)."),
  experience: z.string().optional().describe("La experiencia del usuario con dietas/entrenamientos (ej. experto, ninguna)."),
  recipePreference: z.string().optional().describe("La preferencia de tipo de recetas del usuario (ej. rápidas, altas en proteínas)."),
  wearable: z.string().optional().describe("Si el usuario usa un wearable (ej. sí, no).")
}).describe("Preferencias del usuario obtenidas del cuestionario inicial.");


const RecipeChatInputSchema = z.object({
  userQuery: z.string().describe('La pregunta o mensaje del usuario sobre recetas o cocina. Puede incluir un prefijo "Contexto del usuario: ..." con sus preferencias.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('Historial de la conversación previa para mantener el contexto.'),
  // Opcionalmente, podríamos añadir userPreferences como un campo estructurado aquí si quisiéramos pasarlo por separado
  // userPreferences: UserPreferencesSchema.optional().describe("Preferencias del usuario si fueron recolectadas.")
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

MUY IMPORTANTE: Al inicio de la conversación, el usuario podría proporcionar un bloque de texto que comienza con "Contexto del usuario:". Este contexto contiene sus preferencias y objetivos. DEBES utilizar esta información para personalizar profundamente tus respuestas y hacer preguntas de seguimiento relevantes.
Por ejemplo:
- Si el "Contexto del usuario" indica que su objetivo es "Ganar masa muscular", enfoca tus sugerencias en recetas ricas en proteínas y ofrece consejos sobre ingesta calórica para ese objetivo. Podrías preguntar: "¿Tienes alguna preferencia sobre fuentes de proteína como pollo, pescado, legumbres o tofu?"
- Si el "Contexto del usuario" indica que su experiencia es "Ninguna", explica los conceptos de forma más sencilla y detallada. Podrías preguntar: "¿Te gustaría que te explique algunos términos básicos de cocina o nutrición?"
- Si su preferencia de recetas es "Rápidas", prioriza recetas con pocos ingredientes y tiempos de preparación cortos.

Si el usuario no proporciona un contexto explícito, intenta inferir sus necesidades a partir de su pregunta.

Si el usuario parece no saber qué preguntar, puedes ofrecer proactivamente sugerencias como:
- "¿Te gustaría una receta para ganar masa muscular?"
- "¿Necesitas consejos para medir tu progreso?"
- "¿Quieres saber cómo ajustar tu dieta según tu actividad?"

Historial de la conversación (si existe):
{{#if chatHistory}}
{{#each chatHistory}}
{{role}}: {{{content}}}
{{/each}}
{{/if}}

Consulta del Usuario (puede incluir contexto al inicio):
{{{userQuery}}}

Respuesta de NutriChef AI:
(Proporciona aquí tu respuesta. Si das una receta, incluye ingredientes y pasos claros. Si es una pregunta general, responde de forma informativa y personalizada según el contexto del usuario si está disponible.)
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
    // El contexto de las preferencias del usuario ya está siendo antepuesto a input.userQuery
    // por la lógica del cliente en ai-chat/page.tsx.
    // El historial también se pasa directamente.

    const {output} = await recipeChatPrompt({
        userQuery: input.userQuery, 
        chatHistory: input.chatHistory 
    });

    if (!output) {
      console.error('El modelo de IA no devolvió una salida para recipeChatFlow. Input:', input);
      throw new Error('NutriChef AI no pudo generar una respuesta en este momento.');
    }
    return output;
  }
);

