"use server";

import { authenticatePhoto, type AuthenticatePhotoInput, type AuthenticatePhotoOutput } from '@/ai/flows/photo-authentication';
import { z } from "zod";

const AuthenticatePhotoActionSchema = z.object({
  photoDataUri: z.string().startsWith("data:image/", { message: "Invalid data URI for photo" }),
  checkManipulation: z.boolean(),
});

export async function handlePhotoAuthentication(
  input: AuthenticatePhotoInput
): Promise<{ success: boolean; data?: AuthenticatePhotoOutput; error?: string }> {
  
  const validation = AuthenticatePhotoActionSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    const result = await authenticatePhoto(validation.data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in photo authentication action:", error);
    return { success: false, error: (error as Error).message };
  }
}
