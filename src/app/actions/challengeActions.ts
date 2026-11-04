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
  entryFee: z.number().optional().default(0),
  creatorId: z.string(),
  participants: z.array(z.any()).default([]),
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
    const newChallenge: Challenge = {
      id: `chal-${Date.now()}`,
      ...validation.data,
      entryFee: validation.data.entryFee ?? 0,
      participants: validation.data.participants || [],
    };
    console.log("Creating challenge:", newChallenge);
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
  input: any
): Promise<{ success: boolean; data?: EvaluateChallengeOutput; error?: string }> {
  try {
    let payload: EvaluateChallengeInput;

    if (input?.participants && Array.isArray(input.participants)) {
      payload = { participants: input.participants };
    } else if (input?.numericalData && Array.isArray(input.numericalData)) {
      // Convert legacy separate arrays into participant objects
      const participantsMap = new Map<string, any>();

      input.numericalData.forEach((item: any) => {
        const pId = item.participantId;
        if (!participantsMap.has(pId)) {
          const beforePhoto = input.beforePhotos?.find((p: any) => p.participantId === pId)?.photoDataUri || "https://placehold.co/300x400.png?text=Antes";
          const afterPhoto = input.afterPhotos?.find((p: any) => p.participantId === pId)?.photoDataUri || "https://placehold.co/300x400.png?text=Despues";
          participantsMap.set(pId, {
            participantId: pId,
            before: {
              weight: item.weight || 75,
              waist: item.waist || 80,
              muscleMassPercentage: item.muscleMassPercentage || 20,
              photoDataUri: beforePhoto,
            },
            after: {
              weight: item.weight || 72,
              waist: item.waist || 76,
              muscleMassPercentage: item.muscleMassPercentage || 23,
              photoDataUri: afterPhoto,
            }
          });
        } else {
          // If second record is found, update 'after'
          const existing = participantsMap.get(pId);
          existing.after.weight = item.weight ?? existing.after.weight;
          existing.after.waist = item.waist ?? existing.after.waist;
          existing.after.muscleMassPercentage = item.muscleMassPercentage ?? existing.after.muscleMassPercentage;
        }
      });

      payload = { participants: Array.from(participantsMap.values()) };
    } else {
      payload = {
        participants: [
          {
            participantId: "p1",
            before: { weight: 75, waist: 85, muscleMassPercentage: 20, photoDataUri: "https://placehold.co/300x400.png?text=Antes" },
            after: { weight: 70, waist: 78, muscleMassPercentage: 24, photoDataUri: "https://placehold.co/300x400.png?text=Despues" }
          }
        ]
      };
    }

    console.log("Evaluating challenge with AI. Number of participants:", payload.participants.length);
    const result = await evaluateChallenge(payload);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error evaluating challenge with AI:", error);
    return { success: false, error: (error as Error).message };
  }
}

