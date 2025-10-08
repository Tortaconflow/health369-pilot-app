
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
      // CORRECCIÓN: Usamos 'gemini-pro-latest' como el modelo de texto por defecto,
      // ya que hemos verificado que tu API key tiene acceso a él.
      defaultModel: 'googleai/gemini-pro-latest',
      // MEJORA: Usamos el mismo modelo para visión, ya que los modelos más recientes
      // son multimodales y capaces de manejar tanto texto como imágenes.
      defaultVisionModel: 'googleai/gemini-pro-latest',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
