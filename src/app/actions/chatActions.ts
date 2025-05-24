'use server';

import { chatAboutRecipes, type RecipeChatInput, type RecipeChatOutput } from '@/ai/flows/recipe-chat-flow';
import { z } from 'zod';

const RecipeChatActionSchema = z.object({
  userQuery: z.string().min(1, "El mensaje no puede estar vacío."),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

export async function handleRecipeChat(
  input: RecipeChatInput
): Promise<{ success: boolean; data?: RecipeChatOutput; error?: string }> {
  
  const validation = RecipeChatActionSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    const result = await chatAboutRecipes(validation.data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error en la acción handleRecipeChat:", error);
    let errorMessage = "Ocurrió un error al chatear sobre recetas.";
    if (error && typeof error.message === 'string' && error.message.trim() !== '') {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
