
'use server';
/**
 * @fileOverview Un agente de IA para generar rutinas de entrenamiento personalizadas.
 *
 * - generatePersonalizedWorkout - Una función que genera una rutina de entrenamiento personalizada.
 * - PersonalizedWorkoutInput - El tipo de entrada para la función generatePersonalizedWorkout.
 * - PersonalizedWorkoutOutput - El tipo de retorno para la función generatePersonalizedWorkout.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWorkoutInputSchema = z.object({
  userId: z.string().optional().describe("Identificador único del usuario (opcional)."),
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado']).describe("Nivel de condición física actual del usuario."),
  goals: z.array(z.string()).min(1).describe("Metas principales del usuario (ej. 'perder peso', 'ganar músculo', 'mejorar resistencia')."),
  timeAvailablePerSession: z.string().describe("Tiempo disponible para entrenar por sesión (ej. '30 minutos', '1 hora', '1 hora y 30 minutos')."),
  daysPerWeek: z.coerce.number().min(1).max(7).describe("Número de días a la semana disponibles para entrenar."),
  limitations: z.array(z.string()).optional().describe("Limitaciones físicas o lesiones (ej. 'dolor de rodilla', 'problemas de espalda'). Si no hay, puede ser un array vacío o no incluirse."),
  preferredStyle: z.enum(['hit', 'fuerza_resistencia', 'mixto', 'hipertrofia', 'funcional']).optional().describe("Estilo de entrenamiento preferido: Alta Intensidad (HIT), Fuerza y Resistencia, Hipertrofia (construcción muscular), Funcional o Mixto."),
  availableEquipment: z.array(z.string()).optional().describe("Equipamiento disponible (ej. 'mancuernas', 'bandas de resistencia', 'acceso completo a gimnasio'). Si es solo peso corporal, indicarlo."),
  averageSleepHours: z.number().optional().describe("Horas de sueño promedio por noche durante la última semana."),
  restingHeartRate: z.number().optional().describe("Frecuencia cardíaca en reposo (pulsaciones por minuto)."),
  recentActivitySummary: z.string().optional().describe("Breve resumen de la actividad física reciente, ej. '3 sesiones de cardio ligero, 2 de fuerza moderada en los últimos 7 días', 'sedentario esta semana'."),
  stressLevel: z.enum(['bajo', 'medio', 'alto']).optional().describe("Nivel de estrés percibido por el usuario (bajo, medio, alto).")
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
  nutritionGuidelines: z.string().describe("Pautas generales de nutrición para apoyar los objetivos de esta rutina y el rendimiento (ej. 'Prioriza una ingesta adecuada de proteínas (1.6-2.2g por kg de peso corporal). Mantente bien hidratado. Consume carbohidratos complejos para energía y micronutrientes de frutas y verduras.').")
});
export type PersonalizedWorkoutOutput = z.infer<typeof PersonalizedWorkoutOutputSchema>;

export async function generatePersonalizedWorkout(
  input: PersonalizedWorkoutInput
): Promise<PersonalizedWorkoutOutput> {
  return personalizedWorkoutFlow(input);
}

const workoutPrompt = ai.definePrompt({
  name: 'personalizedWorkoutPrompt',
  input: {schema: PersonalizedWorkoutInputSchema},
  output: {schema: PersonalizedWorkoutOutputSchema},
  prompt: `Eres un Entrenador Personal de élite y experto en ciencias del ejercicio, con décadas de experiencia diseñando programas de entrenamiento altamente efectivos y personalizados, al nivel de figuras legendarias como Mike Mentzer o Arnold Schwarzenegger en sus mejores épocas, pero adaptado a la ciencia moderna.
Tu tarea es crear una rutina de entrenamiento completamente personalizada y optimizada para el usuario, basándote estrictamente en la información proporcionada.

Considera los siguientes datos del usuario:
- Nivel de Condición Física: {{{fitnessLevel}}}
- Metas Principales: {{#each goals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Tiempo Disponible por Sesión: {{{timeAvailablePerSession}}}
- Días por Semana para Entrenar: {{{daysPerWeek}}}
{{#if limitations~}}
- Limitaciones/Lesiones: {{#each limitations}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}} (Adapta los ejercicios para evitar agravar estas condiciones. Si una meta es incompatible con una limitación, prioriza la seguridad y sugiere modificaciones o un enfoque alternativo.)
{{else~}}
- Limitaciones/Lesiones: Ninguna reportada.
{{/if}}
{{#if preferredStyle~}}
- Estilo de Entrenamiento Preferido: {{{preferredStyle}}} (Incorpora principios de este estilo. Si es HIT, enfócate en intensidad y eficiencia. Si es fuerza/resistencia, balancea volumen e intensidad para esos objetivos.)
{{else~}}
- Estilo de Entrenamiento Preferido: Elige el más adecuado según las metas y el nivel del usuario.
{{/if}}
{{#if availableEquipment~}}
- Equipamiento Disponible: {{#each availableEquipment}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}} (Selecciona ejercicios que se puedan realizar con este equipamiento. Si es 'peso corporal', la rutina debe ser exclusivamente con peso corporal.)
{{else~}}
- Equipamiento Disponible: Asume acceso a un gimnasio estándar si no se especifica, o prioriza peso corporal si es más coherente con el perfil.
{{/if}}

Datos Biométricos y de Estilo de Vida (si se proporcionan):
{{#if averageSleepHours~}}
- Horas de Sueño Promedio: {{{averageSleepHours}}} horas/noche (Considera esto para la intensidad y recuperación).
{{/if}}
{{#if restingHeartRate~}}
- Frecuencia Cardíaca en Reposo: {{{restingHeartRate}}} ppm (Puede indicar nivel de fitness o sobreentrenamiento).
{{/if}}
{{#if recentActivitySummary~}}
- Resumen de Actividad Reciente: {{{recentActivitySummary}}} (Ajusta el volumen y la intensidad según la actividad previa).
{{/if}}
{{#if stressLevel~}}
- Nivel de Estrés Percibido: {{{stressLevel}}} (Niveles altos de estrés pueden requerir menor volumen/intensidad o más enfoque en la recuperación).
{{/if}}

La rutina debe:
1.  Ser realista y ejecutable según el tiempo disponible y los días por semana.
2.  Incluir ejercicios fundamentales que trabajen los principales grupos musculares de forma equilibrada.
3.  Estar diseñada para maximizar la eficiencia del tiempo de entrenamiento.
4.  Detallar claramente series, repeticiones (o duración), y tiempos de descanso para cada ejercicio.
5.  Incluir sugerencias para el calentamiento y enfriamiento para cada día de entrenamiento.
6.  Proporcionar una estrategia clara para la progresión gradual (cómo el usuario puede seguir mejorando con el tiempo).
7.  Ofrecer consejos prácticos sobre recuperación (sueño, descanso activo, etc.), especialmente si se proporcionan datos biométricos.
8.  Brindar pautas generales de nutrición que complementen la rutina y los objetivos del usuario.
9.  Si se proporcionan datos biométricos o de estilo de vida (sueño, estrés, actividad reciente, RHR), AJUSTA la intensidad, el volumen, la frecuencia o las recomendaciones de recuperación de la rutina. Por ejemplo, si el sueño es bajo o el estrés es alto, la rutina podría ser más corta, menos intensa, o tener más días de descanso o recuperación activa. Si la actividad reciente fue muy alta, considera una sesión más ligera o de recuperación.

MUY IMPORTANTE: Debes producir ÚNICAMENTE un objeto JSON válido como respuesta, sin ningún otro texto, explicaciones o formato markdown (como \`\`\`json) antes o después del objeto JSON.
El objeto JSON DEBE seguir estrictamente la estructura definida por el esquema de salida. Asegúrate de que todos los campos requeridos estén presentes.

Ejemplo de estructura de salida JSON (los valores son solo ejemplos ilustrativos, genera el contenido real basado en la entrada del usuario):
{
  "workoutName": "Plan de Hipertrofia Intermedio - 4 Días",
  "description": "Rutina enfocada en la ganancia de masa muscular para usuarios con experiencia intermedia, ajustada por datos de sueño.",
  "trainingPrinciplesApplied": ["Sobrecarga progresiva", "Volumen de entrenamiento moderado-alto", "Enfoque en tiempo bajo tensión", "Adaptación por recuperación"],
  "routineStructure": {
    "daysPerWeek": 4,
    "splitDescription": "Torso/Pierna (Upper/Lower)",
    "days": [
      {
        "dayName": "Día 1: Torso A",
        "focus": "Pecho, Espalda, Hombros (énfasis en empuje horizontal)",
        "warmup": "5-10 min cardio ligero. Movilidad articular: círculos de brazos, rotaciones de torso. Series de aproximación para el primer ejercicio.",
        "exercises": [
          { "name": "Press de Banca con Barra", "sets": "4", "reps": "6-10", "rest": "90-120s", "notes": "Controla la fase excéntrica (bajada)." },
          { "name": "Remo con Barra", "sets": "4", "reps": "8-12", "rest": "90s" },
          { "name": "Press Militar con Mancuernas", "sets": "3", "reps": "10-15", "rest": "75s" }
        ],
        "cooldown": "5 min de estiramientos estáticos enfocados en pectoral, dorsal y deltoides."
      }
      // ... más días
    ]
  },
  "progressionStrategy": "Intenta añadir 2.5kg o 1-2 repeticiones a tus levantamientos principales cada semana. Para ejercicios de aislamiento, enfócate en mejorar la conexión mente-músculo y alcanzar el rango alto de repeticiones antes de subir peso.",
  "recoveryRecommendations": "Duerme entre 7-9 horas. Si reportaste menos sueño, considera una siesta o prioriza el descanso. Mantén una hidratación adecuada. Considera el foam rolling o masajes ligeros en días de descanso. No entrenes si sientes dolor agudo.",
  "nutritionGuidelines": "Asegura una ingesta de proteínas de al menos 1.8g/kg de peso corporal. Consume un ligero superávit calórico si el objetivo principal es la hipertrofia. Prioriza alimentos integrales y minimiza procesados."
}

Asegúrate de que TODA tu respuesta sea SOLAMENTE este objeto JSON.
`,
});

const personalizedWorkoutFlow = ai.defineFlow(
  {
    name: 'personalizedWorkoutFlow',
    inputSchema: PersonalizedWorkoutInputSchema,
    outputSchema: PersonalizedWorkoutOutputSchema,
  },
  async (input) => {
    const {output} = await workoutPrompt(input);

    if (!output) {
      console.error('El modelo de IA no devolvió una salida para personalizedWorkoutFlow. Input:', input);
      throw new Error('El modelo de IA no pudo generar una rutina en este momento. La salida fue nula o indefinida.');
    }
    
    const parsedOutput = PersonalizedWorkoutOutputSchema.safeParse(output);
    if (!parsedOutput.success) {
        console.error("PersonalizedWorkoutOutputSchema parsing failed in flow. Input:", input, "Raw Output:", JSON.stringify(output, null, 2), "Zod Errors:", parsedOutput.error.flatten());
        throw new Error(`La salida del modelo de IA no se ajustó al esquema después del procesamiento de Genkit. Problemas: ${JSON.stringify(parsedOutput.error.flatten().fieldErrors)}`);
    }
    
    console.log("Rutina generada con éxito para:", input.userId || 'usuario desconocido');
    return parsedOutput.data;
  }
);
