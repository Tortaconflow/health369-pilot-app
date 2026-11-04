export type VoiceIntentType =
  | 'LOG_SET'
  | 'START_REST'
  | 'SKIP_REST'
  | 'NEXT_EXERCISE'
  | 'PREVIOUS_EXERCISE'
  | 'REPORT_PAIN'
  | 'REPORT_FATIGUE'
  | 'COMPLETE_WORKOUT'
  | 'ASK_COACH'
  | 'EMOTIONAL_REFLECTION';

export interface ExtractedVoiceEntity {
  intent: VoiceIntentType;
  confidence: number;
  data: {
    weightKg?: number;
    reps?: number;
    rpe?: number;
    restSeconds?: number;
    bodyPart?: string;
    rawText: string;
  };
}

export interface ExtractedDebriefData {
  summary: string;
  perceivedDifficulty: 'baja' | 'media' | 'alta' | 'maxima';
  rpeEstimated: number; // 1-10
  reportedDiscomfort?: string; // e.g. "hombro izquierdo"
  sleepHoursReported?: number;
  highlightedAchievements: string[];
  recommendedRecoveryAction: string;
  confidence: number;
}

export type GuardianRiskLevel = 'NORMAL' | 'CAUTION' | 'HIGH_CONCERN' | 'ESCALATE';

export type EmotionalNeedType = 'just_listen' | 'reframe_perspective' | 'actionable_step';

export interface GuardianEvaluation {
  riskLevel: GuardianRiskLevel;
  category?: 'body_image' | 'eating_restriction' | 'overtraining' | 'acute_pain' | 'emotional_fatigue';
  guidanceMessage?: string;
  suggestedAction?: string;
  isRedFlag: boolean;
}
