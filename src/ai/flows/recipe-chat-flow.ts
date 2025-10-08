
'use server';
/**
 * @fileOverview Un agente de IA para chatear sobre recetas y cocina, y para iniciar la recopilación de datos para rutinas de entrenamiento.
 *
 * - chatAboutRecipes - Una función que maneja las conversaciones sobre recetas y la solicitud inicial de datos para rutinas.
 * - RecipeChatInput - El tipo de entrada para la función chatAboutRecipes.
 * - RecipeChatOutput - El tipo de retorno para la función chatAboutRecipes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Esquema para los datos que esperamos del PersonalizedWorkoutInputSchema, para referencia en el prompt.
// Campos requeridos para generar una rutina básica: fitnessLevel, goals, timeAvailablePerSession, daysPerWeek.
const RequiredWorkoutDataContextSchema = z.object({
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado']).describe("Nivel de condición física (ej. 'principiante', 'intermedio', 'avanzado')."),
  goals: z.array(z.string()).min(1).describe("Metas principales (ej. ['perder peso', 'ganar músculo'])."),
  timeAvailablePerSession: z.string().describe("Tiempo disponible por sesión (ej. '30 minutos', '1 hora')."),
  daysPerWeek: z.coerce.number().min(1).max(7).describe("Número de días a la semana para entrenar."),
  // Campos opcionales que también pueden estar en el contexto del usuario:
  limitations: z.array(z.string()).optional().describe("Limitaciones físicas o lesiones."),
  preferredStyle: z.enum(['hit', 'fuerza_resistencia', 'mixto', 'hipertrofia', 'funcional']).optional().describe("Estilo de entrenamiento preferido (HIT, fuerza, etc.)."),
  availableEquipment: z.array(z.string()).optional().describe("Equipamiento disponible."),
  averageSleepHours: z.number().optional().describe("Horas de sueño promedio."),
  restingHeartRate: z.number().optional().describe("Frecuencia cardíaca en reposo."),
  recentActivitySummary: z.string().optional().describe("Resumen de actividad reciente."),
  stressLevel: z.enum(['bajo', 'medio', 'alto']).optional().describe("Nivel de estrés percibido.")
});
export type RequiredWorkoutData = z.infer<typeof RequiredWorkoutDataContextSchema>;

const RecipeChatInputSchema = z.object({
  userQuery: z.string().describe('La pregunta o mensaje del usuario. Puede incluir un prefijo "Contexto del usuario: ..." con sus preferencias.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('Historial de la conversación previa para mantener el contexto.'),
});
export type RecipeChatInput = z.infer<typeof RecipeChatInputSchema>;

const RecipeChatOutputSchema = z.object({
  aiResponse: z.string().describe('La respuesta del asistente de IA.'),
});
export type RecipeChatOutput = z.infer<typeof RecipeChatOutputSchema>;

export async function chatAboutRecipes(input: RecipeChatInput): Promise<RecipeChatOutput> {
  return recipeChatFlow(input);
}

const recipeChatPrompt = ai.definePrompt({
  name: 'recipeChatPrompt',
  input: {schema: RecipeChatInputSchema},
  output: {schema: RecipeChatOutputSchema},
  prompt: `Eres "NutriChef AI", un coach de fitness y nutrición entusiasta y empático para la aplicación Health369. Tu tono es motivador y usas emojis ocasionalmente (💪, 🥗, 🚀).

REGLA DE ORO: Cada respuesta tuya debe terminar con una pregunta abierta para mantener la conversación fluida.

TAREAS:

1.  **CHAT SOBRE RECETAS Y COCINA**: Proporciona recetas, listas de ingredientes y consejos de cocina. Personaliza tus respuestas según el "Contexto del usuario" (ej. si su objetivo es "ganar masa muscular", sugiere recetas altas en proteínas).
    Ejemplo: Usuario: "Necesito una receta para cenar." Tu respuesta: "¡Claro que sí! Para esa cena post-entreno enfocada en ganar músculo, ¿qué tal un salmón al horno con espárragos? Es delicioso y lleno de proteína. 🐟 ¿Te gustaría la receta completa?"

2.  **INICIAR GENERACIÓN DE RUTINAS**:
    *   Si el usuario pide una rutina de entrenamiento (ej. "créame una rutina", "necesito un plan de entrenamiento"), REVISA el "Contexto del usuario" para ver si tienes los datos mínimos (fitnessLevel, goals, timeAvailablePerSession, daysPerWeek).
    *   **SI TIENES LOS DATOS MÍNIMOS**, tu ÚNICA RESPUESTA debe ser la frase EXACTA:
        "¡Excelente! Con la información que me has proporcionado, ya tenemos una buena base para diseñar tu rutina. ¿Quieres que procedamos a generar una propuesta de entrenamiento personalizada para ti?"
    *   **SI FALTAN DATOS MÍNIMOS**, tu ÚNICA RESPUESTA debe ser una pregunta amigable para obtenerlos. Sé específico.
        Ejemplo si falta tiempo y días: "¡Absolutamente! Para empezar a diseñar tu rutina, ¿cuántos días a la semana te gustaría entrenar y cuánto tiempo tienes para cada sesión? 💪"

SUGERENCIAS PROACTIVAS (si el usuario no sabe qué preguntar):
- "¿Qué tal si exploramos algunas recetas para ayudarte con tu meta? 🥗"
- "Si me das algunos detalles sobre tus objetivos y tu nivel, puedo ayudarte a preparar la información para generar una rutina. ¿Qué dices? 🚀"

HISTORIAL DE CONVERSACIÓN (si existe):
{{#if chatHistory}}
{{#each chatHistory}}
{{role}}: {{{content}}}
{{/each}}
{{/if}}

CONSULTA DEL USUARIO (puede incluir contexto al inicio):
{{{userQuery}}}

RESPUESTA DE NUTRICHEF AI:
(Proporciona aquí tu respuesta. Sigue las reglas de arriba. No repitas la pregunta del usuario. Termina siempre con una pregunta abierta.)
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
    console.log("Input a recipeChatPrompt:", JSON.stringify(input, null, 2));

    const {output} = await recipeChatPrompt(input);

    if (!output) {
      console.error('El modelo de IA no devolvió una salida para recipeChatFlow. Input:', input);
      throw new Error('NutriChef AI no pudo generar una respuesta en este momento.');
    }
    
    console.log("Output de recipeChatPrompt:", JSON.stringify(output, null, 2));
    return output;
  }
);
