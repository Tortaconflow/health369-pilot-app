
'use server';
/**
 * @fileOverview A simple flow to greet Gemini.
 * - greetGemini - A function that sends a name to Gemini and gets a greeting.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod'; // Using Zod from Genkit

const GreetInputSchema = z.string().describe("The name to include in the greeting.");
export type GreetInput = z.infer<typeof GreetInputSchema>;

const GreetOutputSchema = z.string().describe("The greeting response from the AI.");
export type GreetOutput = z.infer<typeof GreetOutputSchema>;

// Exported wrapper function
export async function greetGemini(name: GreetInput): Promise<GreetOutput> {
  return helloFlow(name);
}

// The actual Genkit flow
const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: GreetInputSchema,
    outputSchema: GreetOutputSchema,
  },
  async (name) => { // name is GreetInput (string)
    // The default model configured in @/ai/genkit.ts will be used.
    const generationResult = await ai.generate({
        prompt: `Hello Gemini, my name is ${name}. Please write a short, friendly greeting back to me.`,
    });
    
    // Access the generated text. For simple text generation without a specific output schema
    // in ai.generate(), 'text' is the standard way to get the string.
    const text = generationResult.text;

    if (typeof text !== 'string') {
        console.error("AI did not return text for helloFlow. Got:", text);
        throw new Error("AI did not return a valid text response.");
    }
    return text;
  }
);
