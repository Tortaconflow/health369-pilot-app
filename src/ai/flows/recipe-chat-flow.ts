
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
const PartialWorkoutInputContextSchema = z.object({
  fitnessLevel: z.string().optional().describe("Nivel de condición física (principiante, intermedio, avanzado)."),
  goals: z.array(z.string()).optional().describe("Metas principales (ej. 'perder peso', 'ganar músculo')."),
  timeAvailablePerSession: z.string().optional().describe("Tiempo disponible por sesión (ej. '30 minutos')."),
  daysPerWeek: z.coerce.number().optional().describe("Número de días a la semana para entrenar."),
  limitations: z.array(z.string()).optional().describe("Limitaciones físicas o lesiones."),
  preferredStyle: z.string().optional().describe("Estilo de entrenamiento preferido (HIT, fuerza, etc.)."),
  availableEquipment: z.array(z.string()).optional().describe("Equipamiento disponible.")
});


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
  prompt: `Eres "NutriChef AI", un asistente virtual experto en nutrición y cocina para la aplicación Health369. Tu especialidad es ayudar a los usuarios a encontrar y preparar comidas saludables y deliciosas. También puedes ayudar a iniciar el proceso para generar una rutina de entrenamiento.

Debes responder de forma amigable, clara y concisa.

CONTEXTO DEL USUARIO:
Al inicio de la conversación, el usuario podría proporcionar un bloque de texto que comienza con "Contexto del usuario:". Este contexto contiene sus preferencias y objetivos (ej. objetivo principal, experiencia, preferencia de recetas, uso de wearable). DEBES utilizar esta información para personalizar profundamente tus respuestas.

TAREAS PRINCIPALES:

1.  CHAT SOBRE RECETAS Y COCINA:
    *   Proporciona recetas, listas de ingredientes, pasos de preparación, y consejos de cocina cuando se te solicite.
    *   Si el "Contexto del usuario" indica que su objetivo es "Ganar masa muscular", enfoca tus sugerencias de recetas en opciones ricas en proteínas.
    *   Si su experiencia es "Ninguna", explica los conceptos de forma más sencilla.

2.  INICIAR GENERACIÓN DE RUTINAS DE ENTRENAMIENTO:
    *   Si el usuario pide una rutina de entrenamiento (ej. "créame una rutina", "¿qué ejercicios debo hacer?", "necesito un plan de entrenamiento"), tu objetivo es RECOPILAR LA INFORMACIÓN NECESARIA para que otro especialista (otro flujo de IA) pueda diseñar la rutina.
    *   REVISA el "Contexto del usuario" que ya tienes. Los datos importantes para una rutina son:
        *   Nivel de condición física (ej. 'principiante', 'intermedio', 'avanzado').
        *   Metas principales (ej. 'perder peso', 'ganar músculo', 'mejorar resistencia').
        *   Tiempo disponible por sesión (ej. '30 minutos', '1 hora').
        *   Número de días a la semana para entrenar (ej. 3, 5).
        *   Limitaciones físicas o lesiones (ej. 'dolor de rodilla').
        *   Estilo de entrenamiento preferido (ej. 'HIT', 'fuerza y resistencia', 'hipertrofia').
        *   Equipamiento disponible (ej. 'mancuernas', 'peso corporal', 'gimnasio completo').
    *   Si el "Contexto del usuario" NO proporciona toda esta información, tu respuesta DEBE SER una pregunta para obtener los detalles faltantes de forma amigable.
        Ejemplo de respuesta si falta información: "¡Claro que puedo ayudarte con una rutina! Para diseñarla lo mejor posible, necesitaría saber un poco más. Por ejemplo, ¿cuál dirías que es tu nivel de fitness actual (principiante, intermedio o avanzado)? ¿Cuántos días a la semana te gustaría entrenar y cuánto tiempo tienes para cada sesión? También es útil saber si tienes alguna limitación física o qué equipamiento tienes disponible (mancuernas, solo peso corporal, acceso a gimnasio, etc.)."
    *   NO intentes generar una rutina de ejercicios tú mismo en este flujo. Solo recopila la información. Cuando tengas suficiente información (o creas que la tienes), puedes decir algo como: "Perfecto, con estos datos ya podemos empezar a diseñar tu rutina. ¿Listo para que la generemos?" (La generación real la hará otro sistema).

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
