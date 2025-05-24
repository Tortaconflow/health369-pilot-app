"use server";

import { evaluateChallenge, type EvaluateChallengeInput, type EvaluateChallengeOutput } from "@/ai/flows/challenge-evaluation";
import type { Challenge, UserProgress } from "@/types/domain";
import { z } from "zod";

// --- Create Challenge ---
const CreateChallengeSchema = z.object({
  name: z.string(),
  description: z.string(),
  objective: z.string(),
  duration: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  entryFee: z.number().optional(),
  creatorId: z.string(),
  // coverImageUrl: z.string().url().optional(),
  participants: z.array(z.any()), // Simplified for now
  status: z.enum(["upcoming", "active", "completed"]),
});

export async function createChallenge(
  input: z.infer<typeof CreateChallengeSchema>
): Promise<{ success: boolean; data?: Challenge; error?: string }> {
  const validation = CreateChallengeSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    // In a real app, save to Firestore and get an ID
    const newChallenge: Challenge = {
      id: `chal-${Date.now()}`, // Mock ID
      ...validation.data,
    };
    console.log("Creating challenge:", newChallenge);
    // await db.collection('challenges').doc(newChallenge.id).set(newChallenge);
    return { success: true, data: newChallenge };
  } catch (error) {
    console.error("Error creating challenge:", error);
    return { success: false, error: (error as Error).message };
  }
}


// --- Submit Challenge Progress ---
const SubmitProgressSchema = z.object({
  challengeId: z.string(),
  // userId: z.string(), // Would come from auth session
  weight: z.number().optional(),
  waist: z.number().optional(),
  muscleMassPercentage: z.number().optional(),
  notes: z.string().optional(),
  photoDataUri: z.string().optional(), // Data URI of the watermarked photo
  photoManipulationDetected: z.boolean().optional(),
  photoDetectionDetails: z.string().optional(),
  timestamp: z.string().datetime(),
});

type SubmitProgressInput = z.infer<typeof SubmitProgressSchema>;

export async function submitChallengeProgress(
  input: SubmitProgressInput
): Promise<{ success: boolean; data?: UserProgress; error?: string }> {
  const validation = SubmitProgressSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }
  
  try {
    // In a real app, save progress to Firestore under the user and challenge
    // e.g., db.collection('challenges').doc(input.challengeId).collection('participants').doc(input.userId).collection('progress').add(progressEntry);
    const progressEntry: UserProgress = {
      weight: input.weight,
      waist: input.waist,
      muscleMassPercentage: input.muscleMassPercentage,
      // In a real app, store photo URL from storage, not data URI
      // For now, we can assume it's stored or handled as needed
      ...(input.photoDataUri && { progressPhotos: [{ url: "simulated_storage_url_for_photo.jpg", date: input.timestamp, note: input.notes }]}), 
      lastUpdated: input.timestamp,
    };
    console.log("Submitting progress for challenge:", input.challengeId, progressEntry);
    return { success: true, data: progressEntry };
  } catch (error) {
    console.error("Error submitting progress:", error);
    return { success: false, error: (error as Error).message };
  }
}


// --- Evaluate Challenge Completion ---
export async function evaluateChallengeCompletion(
  input: EvaluateChallengeInput
): Promise<{ success: boolean; data?: EvaluateChallengeOutput; error?: string }> {
  try {
    // Input validation for EvaluateChallengeInput could be added here if more complex
    // For now, assume AI flow handles its own Zod schema validation.
    console.log("Evaluating challenge with AI. Input keys:", Object.keys(input));
    console.log("Numerical data length:", input.numericalData.length);
    console.log("Before photos length:", input.beforePhotos.length);
    console.log("After photos length:", input.afterPhotos.length);

    const result = await evaluateChallenge(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error evaluating challenge with AI:", error);
    return { success: false, error: (error as Error).message };
  }
}
