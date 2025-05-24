
export type Expert = {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  bio: string;
  rating: number;
  experienceYears: number;
  certifications: string[];
};

export type ChallengeParticipant = {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  progress?: UserProgress;
};

export type Challenge = {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "7 days", "4 weeks"
  objective: string; // e.g., "Lose 5kg", "Gain 2% muscle mass"
  entryFee: number; // Virtual currency
  creatorId: string;
  participants: ChallengeParticipant[];
  status: 'upcoming' | 'active' | 'completed';
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  winnerId?: string;
  prizePool?: number; // Total virtual currency in the pot
  coverImageUrl?: string;
};

export type UserProgress = {
  weight?: number;
  waist?: number;
  muscleMassPercentage?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  progressPhotos?: { url: string; date: string; note?: string }[];
  lastUpdated: string; // ISO Date string
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  experiencePoints: number;
  badges: string[]; // Array of badge names or IDs
  virtualCurrency: number;
  currentChallengeIds?: string[];
  completedChallengeIds?: string[];
  healthGoals?: string[];
  preferences?: Record<string, any>;
  progress?: UserProgress;
};

export type RecipeSuggestion = {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  calories?: number;
  prepTime?: string;
};

export type RoutineSuggestion = {
  name: string;
  description: string;
  exercises: { name: string; sets?: string; reps?: string; duration?: string }[];
  focusArea?: string;
};

export type AISuggestions = {
  recipe: RecipeSuggestion;
  routine: RoutineSuggestion;
};

export type Exercise = {
  id: string;
  name: string;
  description?: string; // How to do it, details.
  sets?: number | string; // e.g., 4 or "2-3"
  reps?: number | string; // e.g., 12 or "8-12"
  duration?: string; // e.g., "30s", "5 min."
  weight?: string; // e.g., "22.5 kg", "propio peso"
  equipment?: string[]; // e.g., ["banda de resistencia", "mancuernas"]
  muscleGroups?: string[];
  imagePlaceholderUrl: string;
  videoUrl?: string; // Optional link to a video demonstration
  notes?: string; // e.g., "110-140lpm" for treadmill
  dataAiHint?: string;
};

export type Workout = {
  id: string;
  name: string; // e.g., "Pectoral+Espalda+Glúteos"
  dayDescription?: string; // e.g., "1 día de entrenamiento"
  estimatedTime: string; // e.g., "1h. 42 min."
  targetAudience: string; // e.g., "para hombres y mujeres"
  type: "gym" | "home" | "mixed";
  exercises: Exercise[];
  progress?: number; // e.g., 0 for 0%
};

export type MachineInfo = {
  id: string;
  name: string;
  description: string;
  imagePlaceholderUrl: string;
  dataAiHint?: string;
  affectedMuscleGroups: string[];
  commonExercises?: { name: string; id: string }[];
};
