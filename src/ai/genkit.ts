
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // Usamos gemini-pro como el modelo de texto por defecto.
      // Es un modelo de texto capaz y ampliamente compatible.
      defaultModel: 'googleai/gemini-1.5-pro',
      // gemini-pro-vision es ideal para el análisis de imágenes.
      defaultVisionModel: 'googleai/gemini-pro-vision',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
