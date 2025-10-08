
'use server';
/**
 * @fileOverview Photo authentication flow to generate a watermark text.
 * @description This flow's primary purpose is to generate a secure, timestamped watermark text.
 *              The responsibility of applying this watermark to the image is delegated to the client-side (frontend).
 *              This approach is more efficient, reliable, and cost-effective than attempting server-side image manipulation with an AI model.
 *
 * - generateWatermark - A function that creates the watermark text.
 * - GenerateWatermarkInput - The input type for the generateWatermark function.
 * - GenerateWatermarkOutput - The return type for the generateWatermark function.
 */

// CORRECCIÓN: Se importan 'z', 'defineFlow', y 'run' directamente desde 'genkit'.
import {z, defineFlow, run} from 'genkit';

// MEJORA: El esquema de entrada ahora es más simple, ya que no necesitamos la imagen.
// Podríamos añadir un `userId` si se quisiera registrar quién pidió la marca de agua.
const GenerateWatermarkInputSchema = z.object({
  userId: z.string().optional().describe('Optional ID of the user requesting the watermark.'),
});
export type GenerateWatermarkInput = z.infer<typeof GenerateWatermarkInputSchema>;

// MEJORA: El esquema de salida se simplifica para devolver solo el texto de la marca de agua.
const GenerateWatermarkOutputSchema = z.object({
  watermarkText: z.string().describe('The text to be used as a watermark on the photo.'),
  timestamp: z.string().describe('The ISO 8601 timestamp for when the watermark was generated.'),
});
export type GenerateWatermarkOutput = z.infer<typeof GenerateWatermarkOutputSchema>;

/**
 * Generates a standardized watermark text with the current timestamp.
 * This function does NOT process any images. It simply creates the text
 * that the client should apply to the photo.
 * @param input - The input object, can be empty.
 * @returns An object containing the watermark text and timestamp.
 */
export async function generateWatermark(input: GenerateWatermarkInput): Promise<GenerateWatermarkOutput> {
  // Validamos una entrada potencialmente vacía, aunque no sea estrictamente necesario.
  const validatedInput = GenerateWatermarkInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Invalid input for generateWatermark:', validatedInput.error.flatten());
    throw new Error('Invalid input provided.');
  }
  
  try {
    return await run('generateWatermarkFlow', () => generateWatermarkFlow(validatedInput.data));
  } catch (error) {
    console.error('Error executing generateWatermarkFlow:', error);
    throw new Error('Could not generate watermark text at this time.');
  }
}

const generateWatermarkFlow = defineFlow(
  {
    name: 'generateWatermarkFlow',
    inputSchema: GenerateWatermarkInputSchema,
    outputSchema: GenerateWatermarkOutputSchema,
  },
  async (input) => {
    // Lógica central: generar una marca de tiempo fiable.
    const now = new Date();
    const timestamp = now.toISOString(); // Formato estándar y universal (ISO 8601)

    // Formateamos la fecha y hora en un formato legible para el usuario en español.
    const userFriendlyDateTime = now.toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: 'UTC' // Especificamos la zona horaria para consistencia.
    });
    
    const watermarkText = `Health369 - ${userFriendlyDateTime} UTC`;
    
    console.log(`Watermark generated for user: ${input.userId || 'unknown'}`);
    
    // Devolvemos tanto el texto para mostrar como la marca de tiempo oficial.
    return {
      watermarkText,
      timestamp,
    };
  }
);
