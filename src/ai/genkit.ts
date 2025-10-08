import {genkit} from 'genkit';
import {googleAI, gemini15FlashLatest} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15FlashLatest, // Set gemini-1.5-flash-latest as the default model
});
