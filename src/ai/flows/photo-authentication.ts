
'use server';
/**
 * @fileOverview AI-powered photo authentication flow for watermarking and manipulation detection.
 *
 * - authenticatePhoto - A function that handles the photo authentication process.
 * - AuthenticatePhotoInput - The input type for the authenticatePhoto function.
 * - AuthenticatePhotoOutput - The return type for the authenticatePhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuthenticatePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to authenticate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  checkManipulation: z
    .boolean()
    .describe('Whether to check for image manipulation or not.'),
});
export type AuthenticatePhotoInput = z.infer<typeof AuthenticatePhotoInputSchema>;

const AuthenticatePhotoOutputSchema = z.object({
  watermarkedPhotoDataUri: z
    .string()
    .describe(
      'The watermarked photo, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
  manipulationDetected: z
    .boolean()
    .optional()
    .describe('Whether image manipulation was detected or not.'),
  detectionDetails: z
    .string()
    .optional()
    .describe('Details about the detected manipulation, if any.'),
});
export type AuthenticatePhotoOutput = z.infer<typeof AuthenticatePhotoOutputSchema>;

export async function authenticatePhoto(input: AuthenticatePhotoInput): Promise<AuthenticatePhotoOutput> {
  return authenticatePhotoFlow(input);
}

// This prompt describes the overall capability, but the actual image generation
// within the flow uses a more direct prompt to the image model.
const authenticatePhotoPrompt = ai.definePrompt({
  name: 'authenticatePhotoPrompt',
  input: {schema: AuthenticatePhotoInputSchema},
  output: {schema: AuthenticatePhotoOutputSchema},
  prompt: `You are an AI expert in processing images.

  The user has provided a photo that needs to be watermarked with the current date and time.
  If checkManipulation is true, you should also analyze the image to detect any signs of manipulation.

  Return the watermarked photo as a data URI. If manipulation is detected, set manipulationDetected to true and provide details in detectionDetails.

  Photo: {{media url=photoDataUri}}
  Check Manipulation: {{{checkManipulation}}}

  Here's how to construct the data URI for the watermarked image:
  1.  Encode the image data using Base64.
  2.  Prepend the appropriate MIME type (e.g., "data:image/png;base64,") to the Base64 encoded data.

  Ensure the watermarkedPhotoDataUri is correctly formatted. If checkManipulation is false, return the original photo with just the watermark.

  Output format:
  "watermarkedPhotoDataUri": "data:<mimetype>;base64,<encoded_data>",
  "manipulationDetected": <true|false>,
  "detectionDetails": "<details about manipulation>"
  `,
});

const authenticatePhotoFlow = ai.defineFlow(
  {
    name: 'authenticatePhotoFlow',
    inputSchema: AuthenticatePhotoInputSchema,
    outputSchema: AuthenticatePhotoOutputSchema,
  },
  async input => {
    const now = new Date();
    // Using Spanish locale as the app is in Spanish
    const formattedDateTime = now.toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const watermarkText = `Health369 - ${formattedDateTime}`;

    const {media} = await ai.generate({
      model: 'gemini-pro-vision', // This model supports image generation/editing
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Add a visible watermark to this image with the text: "${watermarkText}". Place it in a standard watermark position (e.g., bottom right), ensuring it's legible but not too obstructive.`},
      ],
    });

    let manipulationDetected = false;
    let detectionDetails = '';

    if (input.checkManipulation) {
      // Simulate manipulation detection (replace with actual AI model call later if needed)
      // For a real check, you might use a different AI model or service here.
      const { output: manipulationCheckOutput } = await ai.generate({
        model: 'gemini-pro-vision', // Using a vision model for analysis
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: 'Analyze this image for any signs of digital manipulation or editing. Focus on inconsistencies in lighting, shadows, edges, or unusual patterns. Respond with ONLY a JSON object matching this structure: {"manipulationDetected": true, "detectionDetails": "Example: Slight blurring observed around the subject\'s arm, potentially indicative of editing."} or {"manipulationDetected": false, "detectionDetails": "No obvious signs of manipulation detected."}'}
        ],
        output: {
          schema: z.object({
            manipulationDetected: z.boolean(),
            detectionDetails: z.string()
          })
        }
      });
      
      if (manipulationCheckOutput) {
        manipulationDetected = manipulationCheckOutput.manipulationDetected;
        detectionDetails = manipulationCheckOutput.detectionDetails;
      } else {
        // Fallback if the manipulation check model doesn't respond as expected
        manipulationDetected = false; 
        detectionDetails = 'La verificación de manipulación no pudo completarse.';
      }
    }

    return {
      watermarkedPhotoDataUri: media.url, // This is the data URI of the generated (watermarked) image
      manipulationDetected: manipulationDetected,
      detectionDetails: detectionDetails,
    };
  }
);
