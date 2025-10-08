
'use server';
/**
 * @fileOverview Un agente de IA para generar rutinas de entrenamiento personalizadas.
 *
 * - generatePersonalizedWorkout - Una función que genera una rutina de entrenamiento personalizada.
 * - PersonalizedWorkoutInput - El tipo de entrada para la función generatePersonalizedWorkout.
 * - PersonalizedWorkoutOutput - El tipo de retorno para la función generatePersonalizedWorkout.
 */

import {ai} from '@/ai/genkit';
// CORRECCIÓN: Se importan 'z', 'defineFlow', y 'run' directamente desde 'genkit'.
import {z, defineFlow, run} from 'genkit';

// MEJORA: Se refina la descripción para mayor claridad en los prompts.
const PersonalizedWorkoutInputSchema = z.object({
  userId: z.string().optional().describe("Identificador único del usuario (opcional)."),
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado']).describe("Nivel de condición física actual del usuario."),
  goals: z.array(z.string()).min(1).describe("Metas principales del usuario (ej. 'perder peso', 'ganar músculo', 'mejorar resistencia')."),
  timeAvailablePerSession: z.string().describe("Tiempo disponible para entrenar por sesión (ej. '30 minutos', '1 hora', '1 hora y 30 minutos')."),
  daysPerWeek: z.coerce.number().min(1).max(7).describe("Número de días a la semana disponibles para entrenar."),
  limitations: z.array(z.string()).optional().describe("Limitaciones físicas o lesiones (ej. 'dolor de rodilla', 'problemas de espalda'). Si no hay, puede ser un array vacío o no incluirse."),
  preferredStyle: z.enum(['hit', 'fuerza_resistencia', 'mixto', 'hipertrofia', 'funcional']).optional().describe("Estilo de entrenamiento preferido: Alta Intensidad (HIT), Fuerza y Resistencia, Hipertrofia (construcción muscular), Funcional o Mixto."),
  availableEquipment: z.array(z.string()).optional().describe("Equipamiento disponible (ej. 'mancuernas', 'bandas de resistencia', 'acceso completo a gimnasio'). Si es solo peso corporal, indicarlo."),
  averageSleepHours: z.number().optional().describe("Horas de sueño promedio por noche. Clave para ajustar la intensidad y el volumen de la recuperación."),
  restingHeartRate: z.number().optional().describe("Frecuencia cardíaca en reposo (pulsaciones por minuto). Un indicador del estado de recuperación."),
  recentActivitySummary: z.string().optional().describe("Breve resumen de la actividad física reciente para modular la carga de entrenamiento inicial."),
  stressLevel: z.enum(['bajo', 'medio', 'alto']).optional().describe("Nivel de estrés percibido. Un estrés alto puede requerir una reducción del volumen/intensidad.")
});
export type PersonalizedWorkoutInput = z.infer<typeof PersonalizedWorkoutInputSchema>;

const PersonalizedWorkoutOutputSchema = z.object({
    workoutName: z.string().describe("Nombre descriptivo para la rutina generada (ej. 'Rutina de Fuerza para Principiantes - 3 Días')."),
    description: z.string().describe("Breve descripción o enfoque general de la rutina."),
    trainingPrinciplesApplied: z.array(z.string()).describe("Principios de entrenamiento clave aplicados (ej. 'Sobrecarga progresiva', 'Alta Intensidad', 'Enfoque en compuestos')."),
    routineStructure: z.object({
      daysPerWeek: z.number().describe("Número de días de entrenamiento por semana."),
      splitDescription: z.string().optional().describe("Descripción del split de entrenamiento si aplica (ej. 'Full Body', 'Empuje/Tire/Pierna', 'Torso/Pierna')."),
      days: z.array(z.object({
        dayName: z.string().describe("Nombre o número del día de entrenamiento (ej. 'Día 1', 'Lunes: Empuje')."),
        focus: z.string().optional().describe("Enfoque principal del día (ej. 'Pecho, Hombros, Tríceps', 'Cuerpo Completo')."),
        exercises: z.array(z.object({
          name: z.string().describe("Nombre del ejercicio (ej. 'Sentadillas con barra', 'Flexiones')."),
          sets: z.string().describe("Número de series a realizar (ej. '3-4', '5')."),
          reps: z.string().describe("Rango de repeticiones o tiempo (ej. '8-12', 'AMRAP 5 min', 'Hasta el fallo técnico')."),
          rest: z.string().describe("Tiempo de descanso recomendado entre series (ej. '60-90 segundos', '2 minutos')."),
          tempo: z.string().optional().describe("Tempo de ejecución si es relevante (ej. '2-0-1-0': 2s bajada, 0s pausa abajo, 1s subida, 0s pausa arriba)."),
          notes: z.string().optional().describe("Notas adicionales sobre la ejecución, alternativas o consejos específicos del ejercicio.")
        })).describe("Lista de ejercicios para este día."),
        warmup: z.string().optional().describe("Sugerencias para el calentamiento específico de este día."),
        cooldown: z.string().optional().describe("Sugerencias para el enfriamiento o estiramientos post-entrenamiento para este día.")
      })).describe("Estructura detallada de la rutina para cada día de entrenamiento."),
    }),
    progressionStrategy: z.string().describe("Estrategia general para la progresión en esta rutina (ej. 'Intenta aumentar el peso o las repeticiones cada semana manteniendo una buena forma. Una vez que alcances el rango superior de repeticiones con buen control, incrementa el peso.')."),
    recoveryRecommendations: z.string().describe("Consejos generales sobre recuperación (ej. 'Asegura 7-9 horas de sueño. Considera días de descanso activo como caminatas ligeras. Escucha a tu cuerpo.')."),
    nutritionGuidelines: z.string().describe("Pautas generales de nutrición para apoyar los objetivos de esta rutina y el rendimiento (ej. 'Prioriza una ingesta adecuada de proteínas (1.6-2.2g por kg de peso corporal). Mantente bien hidratado. Consume carhidratos complejos para energía y micronutrientes de frutas y verduras.').")
  });
export type PersonalizedWorkoutOutput = z.infer<typeof PersonalizedWorkoutOutputSchema>;

// MEJORA: Se añade una capa de validación y manejo de errores.
export async function generatePersonalizedWorkout(
  input: PersonalizedWorkoutInput
): Promise<PersonalizedWorkoutOutput> {
  // 1. Validación de Entrada
  const validatedInput = PersonalizedWorkoutInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Entrada inválida para generatePersonalizedWorkout:', validatedInput.error.flatten());
    throw new Error('Los datos proporcionados para generar la rutina son inválidos.');
  }

  // 2. Ejecución del Flujo con reintento
  try {
    return await run('personalizedWorkoutFlow', () => personalizedWorkoutFlow(validatedInput.data));
  } catch (error) {
    console.error('Error al ejecutar personalizedWorkoutFlow:', error);
    // MEJORA: Devolvemos un error más amigable para el usuario.
    throw new Error('No se pudo generar la rutina de entrenamiento en este momento. Por favor, inténtalo de nuevo más tarde.');
  }
}

const workoutPrompt = ai.definePrompt({
  name: 'personalizedWorkoutPrompt',
  input: {schema: PersonalizedWorkoutInputSchema},
  output: {schema: PersonalizedWorkoutOutputSchema},
  // MEJORA: Prompt refinado para ser más directo, enfatizar la adaptación y asegurar el formato JSON.
  prompt: `Eres un Entrenador Personal de IA de clase mundial. Tu propósito es crear una rutina de entrenamiento excepcional, segura y efectiva, basada en los datos del usuario.

DATOS DEL USUARIO:
- Nivel de Condición Física: {{{fitnessLevel}}}
- Metas: {{{goals}}}
- Tiempo por Sesión: {{{timeAvailablePerSession}}}
- Días por Semana: {{{daysPerWeek}}}
- Limitaciones/Lesiones: {{{limitations}}} (Prioridad máxima: adaptar o excluir ejercicios para garantizar la seguridad).
- Estilo Preferido: {{{preferredStyle}}} (Si se proporciona, incorpóralo. Si no, elige el más óptimo).
- Equipamiento: {{{availableEquipment}}} (Limita los ejercicios estrictamente a este equipamiento).

FACTORES DE ESTILO DE VIDA (CLAVE PARA LA ADAPTACIÓN):
- Sueño Promedio: {{{averageSleepHours}}} horas.
- Frecuencia Cardíaca en Reposo: {{{restingHeartRate}}} ppm.
- Actividad Reciente: {{{recentActivitySummary}}}
- Nivel de Estrés: {{{stressLevel}}}

INSTRUCCIONES:
1.  **Analiza y Sintetiza:** Considera TODOS los datos para crear un plan coherente. Los factores de estilo de vida son cruciales. Un sueño bajo o un estrés alto DEBEN moderar la intensidad y/o el volumen del plan.
2.  **Diseña el Plan:** Crea una rutina detallada. Incluye nombre, descripción, principios, estructura por días con ejercicios (series, reps, descanso, notas), calentamiento y enfriamiento.
3.  **Estrategia a Largo Plazo:** Proporciona una estrategia de progresión clara y consejos prácticos de recuperación y nutrición que apoyen el plan.
4.  **SALIDA JSON ESTRICTA:** Tu única salida debe ser un objeto JSON que se ajuste perfectamente al esquema proporcionado. No incluyas texto, explicaciones, ni markdown antes o después del objeto JSON.

Genera el plan de entrenamiento ahora.`,
});

const personalizedWorkoutFlow = defineFlow(
  {
    name: 'personalizedWorkoutFlow',
    inputSchema: PersonalizedWorkoutInputSchema,
    outputSchema: PersonalizedWorkoutOutputSchema,
  },
  async (input) => {
    // MEJORA: Se añade un paso de "run" para un mejor seguimiento en los logs de Genkit.
    const workoutPlan = await run('generate-workout-plan', async () => {
        const {output} = await workoutPrompt(input);
        
        if (!output) {
            // Este caso es poco probable con los modelos actuales, pero es una buena práctica manejarlo.
            throw new Error('El modelo de IA no devolvió ninguna salida.');
        }

        return output;
    });
    
    // MEJORA: Validación robusta de la salida del modelo.
    const parsedOutput = PersonalizedWorkoutOutputSchema.safeParse(workoutPlan);

    if (!parsedOutput.success) {
      // MEJORA: Registro detallado del error de validación para facilitar la depuración.
      console.error("Fallo en la validación del esquema de salida.", {
        input: input,
        rawOutput: JSON.stringify(workoutPlan, null, 2),
        errors: parsedOutput.error.flatten(),
      });
      // CRÍTICO: Este error indica un problema con el prompt o el modelo, ya que no sigue el formato.
      throw new Error(`La salida del modelo de IA no se ajustó al esquema esperado.`);
    }
    
    console.log("Rutina generada y validada con éxito para el usuario:", input.userId || 'desconocido');
    return parsedOutput.data;
  }
);
