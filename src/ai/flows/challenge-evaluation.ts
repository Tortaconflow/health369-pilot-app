
'use server';

/**
 * @fileOverview An AI agent to evaluate the 'best physical change' in a challenge.
 *
 * - evaluateChallenge - A function that handles the challenge evaluation process.
 * - EvaluateChallengeInput - The input type for the evaluateChallenge function.
 * - EvaluateChallengeOutput - The return type for the evaluateChallenge function.
 */

import {ai} from '@/ai/genkit';
// CORRECCIÓN: Se importan 'z', 'defineFlow', y 'run' directamente desde 'genkit'.
import {z, defineFlow, run} from 'genkit';

// MEJORA: Se reestructura la entrada para agrupar todos los datos por participante.
// Esto es CRÍTICO para que el modelo pueda asociar correctamente las fotos y los datos.
const ParticipantDataSchema = z.object({
  participantId: z.string().describe('The unique ID of the participant.'),
  before: z.object({
    weight: z.number().describe('The starting weight of the participant.'),
    waist: z.number().describe('The starting waist measurement.'),
    muscleMassPercentage: z.number().describe('The starting muscle mass percentage.'),
    photoDataUri: z.string().describe("A 'before' photo as a data URI (data:<mimetype>;base64,<encoded_data>).")
  }),
  after: z.object({
    weight: z.number().describe('The final weight of the participant.'),
    waist: z.number().describe('The final waist measurement.'),
    muscleMassPercentage: z.number().describe('The final muscle mass percentage.'),
    photoDataUri: z.string().describe("An 'after' photo as a data URI (data:<mimetype>;base64,<encoded_data>).")
  })
});

const EvaluateChallengeInputSchema = z.object({
  participants: z.array(ParticipantDataSchema).min(1).describe('An array of data for each challenge participant.')
});
export type EvaluateChallengeInput = z.infer<typeof EvaluateChallengeInputSchema>;

const EvaluateChallengeOutputSchema = z.object({
  winnerId: z.string().describe('The ID of the participant with the best physical change.'),
  evaluationSummary: z.string().describe('A detailed summary of the evaluation process, explaining the rationale for choosing the winner.'),
  rankings: z.array(z.object({
    participantId: z.string(),
    rank: z.number(),
    reasoning: z.string()
  })).describe('A ranked list of all participants with a brief reason for their position.')
});
export type EvaluateChallengeOutput = z.infer<typeof EvaluateChallengeOutputSchema>;

// MEJORA: Se añade una capa de validación y manejo de errores.
export async function evaluateChallenge(input: EvaluateChallengeInput): Promise<EvaluateChallengeOutput> {
  const validatedInput = EvaluateChallengeInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Entrada inválida para evaluateChallenge:', validatedInput.error.flatten());
    throw new Error('Los datos proporcionados para la evaluación del desafío son inválidos.');
  }

  try {
    return await run('evaluateChallengeFlow', () => evaluateChallengeFlow(validatedInput.data));
  } catch (error) {
    console.error('Error al ejecutar evaluateChallengeFlow:', error);
    throw new Error('No se pudo completar la evaluación del desafío en este momento. Por favor, inténtalo de nuevo.');
  }
}

const prompt = ai.definePrompt({
  name: 'evaluateChallengePrompt',
  input: {schema: EvaluateChallengeInputSchema},
  output: {schema: EvaluateChallengeOutputSchema},
  // MEJORA: Prompt refinado para ser más específico, estructurado y analítico.
  prompt: `You are an expert panel of unbiased judges for a fitness competition. Your task is to analyze the data for each participant and determine the winner based on the "best overall physical transformation."

  **Evaluation Criteria (in order of importance):**
  1.  **Body Recomposition:** The most important factor. Look for clear visual and numerical evidence of fat loss AND muscle gain. A participant who loses fat while gaining muscle is a top contender.
  2.  **Visual Change:** Analyze the 'before' and 'after' photos. Look for significant improvements in muscle definition, posture, body shape, and reduction in visible body fat.
  3.  **Numerical Improvement:** Compare the changes in weight, waist measurement, and muscle mass percentage.
      -   **Waist Reduction:** A strong indicator of fat loss.
      -   **Muscle Mass % Increase:** A key indicator of positive change.
      -   **Weight Change:** Can be misleading. A small weight change might hide significant body recomposition (fat loss + muscle gain).

  **PARTICIPANT DATA:**

  {{#each participants}}
  ---
  **Participant ID: {{{participantId}}}**

  **Before:**
  - Weight: {{{before.weight}}} kg
  - Waist: {{{before.waist}}} cm
  - Muscle Mass: {{{before.muscleMassPercentage}}}%
  - Photo: {{media url=before.photoDataUri}}

  **After:**
  - Weight: {{{after.weight}}} kg
  - Waist: {{{after.waist}}} cm
  - Muscle Mass: {{{after.muscleMassPercentage}}}%
  - Photo: {{media url=after.photoDataUri}}
  ---
  {{/each}}

  **INSTRUCTIONS:**
  1.  **Analyze Each Participant:** For each participant, carefully compare their 'before' and 'after' data and photos.
  2.  **Rank Participants:** Based on the criteria above, rank all participants from first to last.
  3.  **Determine the Winner:** The participant ranked first is the winner.
  4.  **Write the Summary:** Provide a detailed evaluation summary. Explain WHY the winner was chosen, highlighting the key visual and numerical data that supported your decision. Compare them briefly to other participants to justify their top position.
  5.  **Provide Rankings:** List the final rankings with a short, clear reason for each participant's placement.
  6.  **SALIDA JSON ESTRICTA:** Your entire response must be a single, valid JSON object that conforms to the specified output schema. Do not include any text before or after the JSON object.

  Evaluate the participants and produce the JSON output now.`,
});

const evaluateChallengeFlow = defineFlow(
  {
    name: 'evaluateChallengeFlow',
    inputSchema: EvaluateChallengeInputSchema,
    outputSchema: EvaluateChallengeOutputSchema,
  },
  async (input) => {
    const evaluationResult = await run('evaluate-challenge-data', async () => {
        const {output} = await prompt(input);
        if (!output) {
            throw new Error('The AI model did not return any output.');
        }
        return output;
    });

    const parsedOutput = EvaluateChallengeOutputSchema.safeParse(evaluationResult);
    if (!parsedOutput.success) {
      console.error("Fallo en la validación del esquema de salida.", {
        input: input,
        rawOutput: JSON.stringify(evaluationResult, null, 2),
        errors: parsedOutput.error.flatten(),
      });
      throw new Error(`The AI model's output did not conform to the expected schema.`);
    }

    console.log(`Evaluación del desafío completada. Ganador: ${parsedOutput.data.winnerId}`);
    return parsedOutput.data;
  }
);
