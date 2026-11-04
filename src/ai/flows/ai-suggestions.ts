'use server';

/**
 * @fileOverview Un agente de IA para generar sugerencias personalizadas de salud, nutrición y fitness.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AISuggestionsInputSchema = z.object({
  goal: z.enum(['perder_peso', 'ganar_musculo', 'mantener_forma', 'mejorar_resistencia'])
    .describe("El objetivo principal de fitness del usuario."),
  fitnessLevel: z.enum(['principiante', 'intermedio', 'avanzado'])
    .describe("Nivel de condición física del usuario."),
  recentActivities: z.array(z.string()).optional()
    .describe("Actividades o ejercicios realizados recientemente (ej. ['corrida de 5km', 'sesión de pesas'])."),
  preferredCuisines: z.array(z.string()).optional()
    .describe("Tipos de comida preferidos (ej. 'mediterránea', 'mexicana').")
});
export type AISuggestionsInput = z.infer<typeof AISuggestionsInputSchema>;

const AISuggestionsOutputSchema = z.object({
  recipeSuggestion: z.object({
    name: z.string().describe("Nombre de la receta sugerida."),
    description: z.string().describe("Breve descripción de por qué esta receta es adecuada para el usuario."),
    calories: z.number().optional().describe("Estimación de calorías por porción.")
  }).describe('Una sugerencia de receta personalizada.'),
  
  routineSuggestion: z.object({
    activity: z.string().describe("Tipo de actividad o ejercicio sugerido."),
    description: z.string().describe("Breve descripción de por qué esta actividad es beneficiosa."),
    duration: z.string().optional().describe("Duración sugerida para la actividad (ej. '30 minutos').")
  }).describe('Una sugerencia de rutina o actividad física personalizada.')
});
export type AISuggestionsOutput = z.infer<typeof AISuggestionsOutputSchema>;

export async function generateAISuggestions(
  input: AISuggestionsInput
): Promise<AISuggestionsOutput> {
  const validatedInput = AISuggestionsInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Entrada inválida para generateAISuggestions:', validatedInput.error.flatten());
    throw new Error('Los datos proporcionados para generar sugerencias son inválidos.');
  }

  try {
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      return await aiSuggestionsFlow(validatedInput.data);
    }
  } catch (error) {
    console.warn('Genkit suggestions offline, using Valky intelligent fallback:', error);
  }

  // Adaptive smart fallback for Valky
  const goalMap: Record<string, { recipe: string; rDesc: string; cals: number; routine: string; wDesc: string; duration: string }> = {
    ganar_musculo: {
      recipe: "Bowl de Pollo Asado con Quinoa y Aguacate",
      rDesc: "Aporte de 42g de proteína de alto valor biológico y carbohidratos complejos para estimular la síntesis muscular.",
      cals: 580,
      routine: "Sobrecarga Progresiva: Día de Empuje (Pecho, Hombro, Tríceps)",
      wDesc: "4 ejercicios fundamentales con enfoque en técnica estricta y 2 minutos de descanso entre series pesadas.",
      duration: "45 min"
    },
    perder_peso: {
      recipe: "Ensalada Mediterránea con Salmón y Semillas de Calabaza",
      rDesc: "Baja densidad calórica y alta saciedad con ácidos grasos omega-3 antiinflamatorios.",
      cals: 420,
      routine: "Intervalos de Resistencia Metabólica (HIIT Suave)",
      wDesc: "Circuitos funcionales para maximizar el gasto calórico preservando la masa muscular.",
      duration: "30 min"
    },
    mejorar_resistencia: {
      recipe: "Avena Nocturna con Proteína, Chía y Frutos Rojos",
      rDesc: "Energía sostenida de liberación lenta y antioxidantes para proteger el tejido muscular.",
      cals: 460,
      routine: "Carrera Continua en Zona 2 + Movilidad Articular",
      wDesc: "Trabajo aeróbico para expandir la capacidad mitocondrial y la recuperación cardiovascular.",
      duration: "40 min"
    },
    mantener_forma: {
      recipe: "Tacos de Pescado con Tortillas de Maíz y Guacamole Fresco",
      rDesc: "Comida equilibrada con macronutrientes balanceados para vitalidad diaria.",
      cals: 490,
      routine: "Full Body Funcional con Peso Corporal",
      wDesc: "Estimulación de todos los grupos musculares con ejercicios multiarticulares.",
      duration: "35 min"
    }
  };

  const selected = goalMap[validatedInput.data.goal] || goalMap.ganar_musculo;

  return {
    recipeSuggestion: {
      name: selected.recipe,
      description: selected.rDesc,
      calories: selected.cals,
    },
    routineSuggestion: {
      activity: selected.routine,
      description: selected.wDesc,
      duration: selected.duration,
    }
  };
}

const prompt = ai.definePrompt({
  name: 'aiSuggestionsPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: AISuggestionsInputSchema},
  output: {schema: AISuggestionsOutputSchema},
  prompt: `Eres un coach de salud y fitness proactivo y motivador de Valky. Tu tarea es generar una sugerencia de receta y una sugerencia de actividad física, personalizadas según los datos del usuario.

Datos del usuario:
- Objetivo principal: {{goal}}
- Nivel de fitness: {{fitnessLevel}}
{{#if recentActivities}}
- Actividades recientes:
{{#each recentActivities}}
  - {{this}}
{{/each}}
{{/if}}
{{#if preferredCuisines}}
- Cocinas preferidas:
{{#each preferredCuisines}}
  - {{this}}
{{/each}}
{{/if}}

Genera una respuesta con:
1. Una sugerencia de receta atractiva, saludable y acorde a su objetivo y preferencias.
2. Una sugerencia de rutina o actividad física práctica y motivadora, acorde a su nivel y objetivo.
`,
});

const aiSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSuggestionsFlow',
    inputSchema: AISuggestionsInputSchema,
    outputSchema: AISuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Sin respuesta del modelo.');
    }
    return output;
  }
);
