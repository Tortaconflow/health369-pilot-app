'use server';

/**
 * @fileOverview Un agente de IA para generar rutinas de entrenamiento personalizadas para Valky.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedWorkoutInputSchema = z.object({
  userId: z.string().optional().describe("Identificador único del usuario (opcional)."),
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado']).describe("Nivel de condición física actual del usuario."),
  goals: z.array(z.string()).min(1).describe("Metas principales del usuario (ej. 'perder peso', 'ganar músculo', 'mejorar resistencia')."),
  timeAvailablePerSession: z.string().describe("Tiempo disponible para entrenar por sesión (ej. '30 minutos', '1 hora', '1 hora y 30 minutos')."),
  daysPerWeek: z.coerce.number().min(1).max(7).describe("Número de días a la semana disponibles para entrenar."),
  limitations: z.array(z.string()).optional().describe("Limitaciones físicas o lesiones."),
  preferredStyle: z.enum(['hit', 'fuerza_resistencia', 'mixto', 'hipertrofia', 'funcional']).optional().describe("Estilo de entrenamiento preferido."),
  availableEquipment: z.array(z.string()).optional().describe("Equipamiento disponible."),
  averageSleepHours: z.number().optional().describe("Horas de sueño promedio por noche."),
  restingHeartRate: z.number().optional().describe("Frecuencia cardíaca en reposo."),
  recentActivitySummary: z.string().optional().describe("Breve resumen de la actividad física reciente."),
  stressLevel: z.enum(['bajo', 'medio', 'alto']).optional().describe("Nivel de estrés percibido.")
});
export type PersonalizedWorkoutInput = z.infer<typeof PersonalizedWorkoutInputSchema>;

export type GeneratedExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  tempo?: string;
  tips?: string;
  notes?: string;
};

export type GeneratedDaySchedule = {
  day: string;
  dayName?: string;
  focus: string;
  warmup?: string;
  cooldown?: string;
  exercises: GeneratedExercise[];
};

export type PersonalizedWorkoutOutput = {
  planName: string;
  workoutName?: string;
  overview: string;
  description?: string;
  trainingPrinciplesApplied?: string[];
  progressionStrategy: string;
  recoveryRecommendations: string;
  nutritionGuidelines: string;
  schedule: GeneratedDaySchedule[];
  routineStructure?: {
    daysPerWeek: number;
    splitDescription?: string;
    days: GeneratedDaySchedule[];
  };
};

const PersonalizedWorkoutOutputSchema = z.object({
  workoutName: z.string(),
  description: z.string(),
  trainingPrinciplesApplied: z.array(z.string()),
  routineStructure: z.object({
    daysPerWeek: z.number(),
    splitDescription: z.string().optional(),
    days: z.array(z.object({
      dayName: z.string(),
      focus: z.string().optional(),
      exercises: z.array(z.object({
        name: z.string(),
        sets: z.string(),
        reps: z.string(),
        rest: z.string(),
        tempo: z.string().optional(),
        notes: z.string().optional(),
      })),
      warmup: z.string().optional(),
      cooldown: z.string().optional(),
    })),
  }),
  progressionStrategy: z.string(),
  recoveryRecommendations: z.string(),
  nutritionGuidelines: z.string(),
});

export async function generatePersonalizedWorkout(
  input: PersonalizedWorkoutInput
): Promise<PersonalizedWorkoutOutput> {
  const validatedInput = PersonalizedWorkoutInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Entrada inválida para generatePersonalizedWorkout:', validatedInput.error.flatten());
    throw new Error('Los datos proporcionados para generar la rutina son inválidos.');
  }

  try {
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      const onlineResult = await personalizedWorkoutFlow(validatedInput.data);
      const schedule: GeneratedDaySchedule[] = onlineResult.routineStructure.days.map(d => ({
        day: d.dayName,
        focus: d.focus || "Acondicionamiento General",
        exercises: d.exercises.map(e => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          rest: e.rest,
          tips: e.notes,
        })),
        warmup: d.warmup,
        cooldown: d.cooldown,
      }));

      return {
        planName: onlineResult.workoutName,
        overview: onlineResult.description,
        schedule,
        progressionStrategy: onlineResult.progressionStrategy,
        recoveryRecommendations: onlineResult.recoveryRecommendations,
        nutritionGuidelines: onlineResult.nutritionGuidelines,
      };
    }
  } catch (error) {
    console.warn('Genkit online workout flow offline, using Valky Smart Fallback:', error);
  }

  // Intelligent Valky Routine Fallback
  const isBeginner = validatedInput.data.fitnessLevel === 'principiante';
  const planTitle = isBeginner
    ? "Protocolo Valky de Inicio: Fundamentos del Superhéroe"
    : "Protocolo Valky de Rendimiento & Recomposición";

  const schedule: GeneratedDaySchedule[] = [
    {
      day: "Día 1: Empuje y Fuerza de Tren Superior",
      focus: "Pecho, Hombros y Core",
      warmup: "5 min de rotaciones articulares y elevaciones de rodilla",
      cooldown: "5 min de estiramiento de pectorales y tríceps",
      exercises: [
        { name: "Flexiones de Brazos (en suelo o inclinadas)", sets: "3", reps: isBeginner ? "8-10" : "12-15", rest: "90s", tips: "Mantén el abdomen activado como tabla." },
        { name: "Press de Hombro con Mancuernas / Botellas", sets: "3", reps: "10-12", rest: "60s", tips: "Empuja verticalmente sin arquear la espalda." },
        { name: "Fondos en Silla o Banco", sets: "3", reps: "10-12", rest: "60s", tips: "Baja controlado sintiendo el trabajo en tríceps." },
        { name: "Plancha Abdominal Isométrica", sets: "3", reps: "30-40s", rest: "60s", tips: "Aprieta glúteos y respira con el diafragma." }
      ]
    },
    {
      day: "Día 2: Fuerza y Potencia de Piernas",
      focus: "Cuádriceps, Glúteos y Gemelos",
      warmup: "5 min de sentadillas al aire y zancadas suaves",
      cooldown: "5 min de estiramiento de isquiotibiales y cuádriceps",
      exercises: [
        { name: "Sentadillas Profundas con Peso Corporal", sets: "4", reps: "12-15", rest: "90s", tips: "Espalda recta y rodillas alineadas con la punta de los pies." },
        { name: "Zancadas Alternas (Lunges)", sets: "3", reps: "10 por pierna", rest: "60s", tips: "Paso firme manteniendo el torso erguido." },
        { name: "Puente de Glúteos en el Suelo", sets: "3", reps: "15", rest: "45s", tips: "Aguanta 1 segundo de máxima contracción arriba." },
        { name: "Elevaciones de Gemelos de Pie", sets: "3", reps: "20", rest: "45s", tips: "Rango completo de movimiento." }
      ]
    },
    {
      day: "Día 3: Tracción, Espalda y Resistencia Metabólica",
      focus: "Espalda, Bíceps y Capacidad Cardiovascular",
      warmup: "5 min de saltos suaves y apertura de brazos",
      cooldown: "5 min de respiración profunda y estiramiento de dorsales",
      exercises: [
        { name: "Remo con Mancuerna o Mochila con Peso", sets: "4", reps: "10-12", rest: "60s", tips: "Lleva los codos hacia la cadera apretando dorsales." },
        { name: "Curl de Bíceps", sets: "3", reps: "12-15", rest: "45s", tips: "Codos pegados al torso sin balancear el cuerpo." },
        { name: "Mountain Climbers (Escaladores)", sets: "3", reps: "30s", rest: "45s", tips: "Ritmo continuo manteniendo la cadera baja." },
        { name: "Superman Isométrico en Suelo", sets: "3", reps: "12 (2s pausa)", rest: "45s", tips: "Fortalece la zona lumbar y la postura." }
      ]
    }
  ];

  return {
    planName: planTitle,
    overview: `Plan diseñado específicamente para nivel ${validatedInput.data.fitnessLevel}, con foco en ${validatedInput.data.goals.join(', ')}. Estructurado en 3 días clave para maximizar resultados sin fatiga excesiva.`,
    schedule,
    progressionStrategy: "Anota las repeticiones que lograste hoy. La próxima semana intenta agregar 1 repetición más por serie o aumentar ligeramente el peso manteniendo una técnica limpia.",
    recoveryRecommendations: "Asegura 7-8 horas de sueño de calidad. En los días de descanso realiza caminatas ligeras de 20 minutos para acelerar el drenaje del dolor muscular.",
    nutritionGuidelines: "Consume entre 1.6g y 2.0g de proteína por kg de peso corporal al día. Hidrátate con al menos 2.5L de agua."
  };
}

const workoutPrompt = ai.definePrompt({
  name: 'personalizedWorkoutPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: PersonalizedWorkoutInputSchema},
  output: {schema: PersonalizedWorkoutOutputSchema},
  prompt: `Eres un Entrenador Personal de IA de clase mundial de Valky. Tu propósito es crear una rutina de entrenamiento excepcional, segura y motivadora para superhéroes.`,
});

const personalizedWorkoutFlow = ai.defineFlow(
  {
    name: 'personalizedWorkoutFlow',
    inputSchema: PersonalizedWorkoutInputSchema,
    outputSchema: PersonalizedWorkoutOutputSchema,
  },
  async (input) => {
    const { output } = await workoutPrompt(input);
    if (!output) throw new Error('Sin respuesta del modelo.');
    return output;
  }
);
