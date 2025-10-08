
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
      // Usamos gemini-pro como el modelo de texto por defecto.
      defaultModel: 'googleai/gemini-pro',
      // Usamos gemini-pro-vision como el modelo de visión por defecto.
      defaultVisionModel: 'googleai/gemini-pro-vision',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
