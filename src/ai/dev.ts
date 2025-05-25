
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-suggestions.ts';
import '@/ai/flows/photo-authentication.ts';
import '@/ai/flows/challenge-evaluation.ts';
import '@/ai/flows/recipe-chat-flow.ts';
import '@/ai/flows/personalized-workout-flow.ts'; // Nueva importación

