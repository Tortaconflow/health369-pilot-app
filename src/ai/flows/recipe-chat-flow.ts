
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
  fitnessLevel: z.string().describe("Nivel de condición física (ej. 'principiante', 'intermedio', 'avanzado')."),
  goals: z.array(z.string()).describe("Metas principales (ej. 'perder peso', 'ganar músculo')."),
  timeAvailablePerSession: z.string().describe("Tiempo disponible por sesión (ej. '30 minutos', '1 hora')."),
  daysPerWeek: z.coerce.number().describe("Número de días a la semana para entrenar."),
  // Campos opcionales que también pueden estar en el contexto del usuario:
  limitations: z.array(z.string()).optional().describe("Limitaciones físicas o lesiones."),
  preferredStyle: z.string().optional().describe("Estilo de entrenamiento preferido (HIT, fuerza, etc.)."),
  availableEquipment: z.array(z.string()).optional().describe("Equipamiento disponible.")
});
export type RequiredWorkoutData = z.infer<typeof RequiredWorkoutDataContextSchema>;

const RecipeChatInputSchema = z.object({
  userQuery: z.string().describe('La pregunta o mensaje del usuario. Puede incluir un prefijo "Contexto del usuario: ..." con sus preferencias.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('Historial de la conversación previa para mantener el contexto.'),
  // Podríamos pasar el contexto del usuario ya parseado si lo tenemos en el frontend.
  // Por ahora, el prompt lo extraerá de userQuery si está presente.
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
  prompt: `Eres "NutriChef AI", un asistente virtual experto en nutrición y cocina para la aplicación Health369. Tu especialidad es ayudar a los usuarios a encontrar y preparar comidas saludables y deliciosas. También puedes ayudar a iniciar el proceso para generar una rutina de entrenamiento.

Debes responder de forma amigable, clara y concisa.

CONTEXTO DEL USUARIO:
Al inicio de la conversación, el usuario podría proporcionar un bloque de texto que comienza con "Contexto del usuario:". Este contexto contiene sus preferencias y objetivos (ej. objetivo principal, experiencia, preferencia de recetas, uso de wearable, nivel de fitness, días de entreno, tiempo por sesión, etc.). DEBES utilizar esta información para personalizar profundamente tus respuestas.

TAREAS PRINCIPALES:

1.  CHAT SOBRE RECETAS Y COCINA:
    *   Proporciona recetas, listas de ingredientes, pasos de preparación, y consejos de cocina cuando se te solicite.
    *   Si el "Contexto del usuario" indica que su objetivo es "Ganar masa muscular", enfoca tus sugerencias de recetas en opciones ricas en proteínas.
    *   Si su experiencia es "Ninguna", explica los conceptos de forma más sencilla.

2.  INICIAR GENERACIÓN DE RUTINAS DE ENTRENAMIENTO:
    *   Si el usuario pide una rutina de entrenamiento (ej. "créame una rutina", "¿qué ejercicios debo hacer?", "necesito un plan de entrenamiento"), tu objetivo es RECOPILAR LA INFORMACIÓN NECESARIA para que otro especialista (otro flujo de IA) pueda diseñar la rutina.
    *   REVISA el "Contexto del usuario" que ya tienes. Los datos **requeridos** para una rutina son:
        *   Nivel de condición física (fitnessLevel - ej. 'principiante', 'intermedio', 'avanzado').
        *   Metas principales (goals - ej. ['perder peso', 'ganar músculo']).
        *   Tiempo disponible por sesión (timeAvailablePerSession - ej. '30 minutos', '1 hora').
        *   Número de días a la semana para entrenar (daysPerWeek - ej. 3, 5).
    *   Datos opcionales pero útiles son: limitaciones, estilo de entrenamiento preferido, equipamiento disponible.
    *   Si el "Contexto del usuario" NO proporciona alguno de los datos **requeridos**, tu respuesta DEBE SER una pregunta para obtener los detalles faltantes de forma amigable. Sé específico sobre lo que falta.
        Ejemplo si falta tiempo y días: "¡Claro que puedo ayudarte con una rutina! Para diseñarla lo mejor posible, necesitaría saber un poco más. Por ejemplo, ¿cuántos días a la semana te gustaría entrenar y cuánto tiempo tienes para cada sesión?"
        Ejemplo si falta el nivel: "Entendido. Para crear una rutina efectiva, ¿podrías indicarme cuál consideras que es tu nivel de fitness actual (principiante, intermedio o avanzado)?"
    *   NO intentes generar una rutina de ejercicios tú mismo en este flujo. Solo recopila la información.
    *   Una vez que tengas TODOS los datos **requeridos** (fitnessLevel, goals, timeAvailablePerSession, daysPerWeek), DEBES preguntar al usuario si desea proceder. Responde con la siguiente frase EXACTA o una muy similar para que el sistema pueda detectarla:
        "¡Excelente! Con la información que me has proporcionado, ya tenemos una buena base para diseñar tu rutina. ¿Quieres que procedamos a generar una propuesta de entrenamiento personalizada para ti?"
        (Si también tienes datos opcionales, puedes mencionarlos brevemente: "Teniendo en cuenta tu nivel {fitnessLevel}, tus metas {goals}, que entrenarás {daysPerWeek} días por {timeAvailablePerSession} y tu preferencia por {preferredStyle}, podemos diseñar algo genial.")

SUGERENCIAS PROACTIVAS:
Si el usuario no sabe qué preguntar, puedes ofrecer proactivamente sugerencias como:
- "¿Te gustaría una receta para ganar masa muscular?"
- "¿Necesitas consejos para medir tu progreso?"
- "¿Quieres saber cómo ajustar tu dieta según tu actividad?"
- "Si me das algunos detalles sobre tus metas y tu nivel, puedo ayudarte a preparar la información para generar una rutina de entrenamiento."

HISTORIAL DE CONVERSACIÓN (si existe):
{{#if chatHistory}}
{{#each chatHistory}}
{{role}}: {{{content}}}
{{/each}}
{{/if}}

CONSULTA DEL USUARIO (puede incluir contexto al inicio):
{{{userQuery}}}

RESPUESTA DE NUTRICHEF AI:
(Proporciona aquí tu respuesta. Si das una receta, incluye ingredientes y pasos claros. Si es una pregunta general, responde de forma informativa y personalizada según el contexto del usuario si está disponible. Si es sobre rutinas, sigue las instrucciones de "INICIAR GENERACIÓN DE RUTINAS DE ENTRENAMIENTO".)
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
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
