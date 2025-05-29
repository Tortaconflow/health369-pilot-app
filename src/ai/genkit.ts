import {genkit} from 'genkit';
import {googleAI, gemini15Flash} from '@genkit-ai/googleai'; // Import gemini15Flash

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Set gemini15Flash as the default model
});
