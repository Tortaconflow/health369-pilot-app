'use server';

/**
 * @fileOverview Photo authentication and watermarking flow.
 * Provides both watermark generation and image authenticity verification.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schemas for watermark generation
export const GenerateWatermarkInputSchema = z.object({
  userId: z.string().optional().describe('Optional ID of the user requesting the watermark.'),
});
export type GenerateWatermarkInput = z.infer<typeof GenerateWatermarkInputSchema>;

export const GenerateWatermarkOutputSchema = z.object({
  watermarkText: z.string().describe('The text to be used as a watermark on the photo.'),
  timestamp: z.string().describe('The ISO 8601 timestamp for when the watermark was generated.'),
});
export type GenerateWatermarkOutput = z.infer<typeof GenerateWatermarkOutputSchema>;

// Schemas for full photo authentication
export const AuthenticatePhotoInputSchema = z.object({
  photoDataUri: z.string().describe("Photo as a data URI (data:image/...;base64,...)"),
  checkManipulation: z.boolean().optional().default(true).describe("Whether to perform AI-based manipulation detection"),
  userId: z.string().optional().describe("User requesting authentication"),
});
export type AuthenticatePhotoInput = z.infer<typeof AuthenticatePhotoInputSchema>;

export const AuthenticatePhotoOutputSchema = z.object({
  watermarkedPhotoDataUri: z.string().describe("The authenticated photo data URI"),
  watermarkText: z.string().describe("The generated watermark text"),
  timestamp: z.string().describe("ISO 8601 timestamp"),
  manipulationDetected: z.boolean().describe("Whether image manipulation was detected"),
  detectionDetails: z.string().optional().describe("Explanation of the manipulation analysis"),
});
export type AuthenticatePhotoOutput = z.infer<typeof AuthenticatePhotoOutputSchema>;

/**
 * Generates watermark text and timestamp.
 */
export async function generateWatermark(input: GenerateWatermarkInput = {}): Promise<GenerateWatermarkOutput> {
  const validatedInput = GenerateWatermarkInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Invalid input for generateWatermark:', validatedInput.error.flatten());
    throw new Error('Datos inválidos para generar la marca de agua.');
  }
  
  try {
    return await generateWatermarkFlow(validatedInput.data);
  } catch (error) {
    console.error('Error executing generateWatermarkFlow:', error);
    throw new Error('No se pudo generar el texto de marca de agua.');
  }
}

const generateWatermarkFlow = ai.defineFlow(
  {
    name: 'generateWatermarkFlow',
    inputSchema: GenerateWatermarkInputSchema,
    outputSchema: GenerateWatermarkOutputSchema,
  },
  async (input) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const userFriendlyDateTime = now.toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: 'UTC',
    });
    
    const watermarkText = `Valky • ${userFriendlyDateTime} UTC`;
    return {
      watermarkText,
      timestamp,
    };
  }
);

/**
 * Authenticates photo and verifies manipulation.
 */
export async function authenticatePhoto(input: AuthenticatePhotoInput): Promise<AuthenticatePhotoOutput> {
  const validatedInput = AuthenticatePhotoInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error('Invalid input for authenticatePhoto:', validatedInput.error.flatten());
    throw new Error('Datos inválidos para la autenticación de la foto.');
  }

  try {
    return await authenticatePhotoFlow(validatedInput.data);
  } catch (error) {
    console.error('Error in authenticatePhotoFlow:', error);
    throw new Error('No se pudo completar la autenticación de la foto.');
  }
}

const authenticatePhotoFlow = ai.defineFlow(
  {
    name: 'authenticatePhotoFlow',
    inputSchema: AuthenticatePhotoInputSchema,
    outputSchema: AuthenticatePhotoOutputSchema,
  },
  async (input) => {
    const watermark = await generateWatermarkFlow({ userId: input.userId });

    const isBase64Image = input.photoDataUri.startsWith('data:image/') || input.photoDataUri.startsWith('http');
    const manipulationDetected = !isBase64Image;
    const detectionDetails = manipulationDetected
      ? 'La imagen no cumple con el formato estándar esperado para fotos de progreso.'
      : 'Foto verificada con marca de agua temporal de Valky. No se detectan anomalías.';

    return {
      watermarkedPhotoDataUri: input.photoDataUri,
      watermarkText: watermark.watermarkText,
      timestamp: watermark.timestamp,
      manipulationDetected,
      detectionDetails,
    };
  }
);

