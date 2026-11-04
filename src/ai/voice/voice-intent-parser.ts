import { ExtractedVoiceEntity, ExtractedDebriefData } from "@/types/companion";

export class VoiceIntentParser {
  /**
   * Extrae la intención y entidades clave de un comando de voz en el gimnasio
   */
  public static parseWorkoutCommand(text: string): ExtractedVoiceEntity {
    const raw = text.toLowerCase().trim();

    // 1. Comando: Siguiente ejercicio
    if (raw.includes("siguiente") || raw.includes("proximo") || raw.includes("próximo") || raw.includes("next")) {
      return {
        intent: 'NEXT_EXERCISE',
        confidence: 0.95,
        data: { rawText: text },
      };
    }

    // 2. Comando: Ejercicio anterior
    if (raw.includes("anterior") || raw.includes("atras") || raw.includes("atrás") || raw.includes("previo")) {
      return {
        intent: 'PREVIOUS_EXERCISE',
        confidence: 0.95,
        data: { rawText: text },
      };
    }

    // 3. Comando: Descanso / Timer
    if (raw.includes("descanso") || raw.includes("pausa") || raw.includes("timer") || raw.includes("minuto")) {
      let seconds = 60;
      if (raw.includes("30") || raw.includes("treinta")) seconds = 30;
      else if (raw.includes("90") || raw.includes("minuto y medio") || raw.includes("noventa")) seconds = 90;
      else if (raw.includes("2 minuto") || raw.includes("120") || raw.includes("dos minuto")) seconds = 120;
      else if (raw.includes("1 minuto") || raw.includes("un minuto") || raw.includes("60")) seconds = 60;

      return {
        intent: 'START_REST',
        confidence: 0.9,
        data: { restSeconds: seconds, rawText: text },
      };
    }

    // 4. Comando: Finalizar entrenamiento
    if (raw.includes("termine") || raw.includes("terminé") || raw.includes("finalizar") || raw.includes("completar entreno") || raw.includes("acabe") || raw.includes("acabé")) {
      return {
        intent: 'COMPLETE_WORKOUT',
        confidence: 0.95,
        data: { rawText: text },
      };
    }

    // 5. Comando: Reporte de dolor / molestia
    if (raw.includes("duele") || raw.includes("dolor") || raw.includes("molesto") || raw.includes("molestó") || raw.includes("pinchazo")) {
      let bodyPart = "articulación no especificada";
      if (raw.includes("hombro")) bodyPart = "hombro";
      else if (raw.includes("rodilla")) bodyPart = "rodilla";
      else if (raw.includes("espalda") || raw.includes("lumbar")) bodyPart = "espalda";
      else if (raw.includes("codo")) bodyPart = "codo";
      else if (raw.includes("cuello")) bodyPart = "cuello";
      else if (raw.includes("muñeca")) bodyPart = "muñeca";

      return {
        intent: 'REPORT_PAIN',
        confidence: 0.9,
        data: { bodyPart, rawText: text },
      };
    }

    // 6. Comando: Registro de Serie (Ej: "80 por 8", "80 kilos 10 repeticiones", "50 kg 12 reps")
    // Pattern: [peso] por [reps] OR [peso] kilos [reps]
    const setPattern1 = /(\d+(?:\.\d+)?)\s*(?:kilos?|kg)?\s*(?:por|x|\*)\s*(\d+)/i;
    const setPattern2 = /(\d+(?:\.\d+)?)\s*(?:kilos?|kg)\s*(?:y\s*)?(\d+)\s*(?:reps?|repeticiones)?/i;

    const match1 = raw.match(setPattern1);
    const match2 = raw.match(setPattern2);

    if (match1) {
      const weightKg = parseFloat(match1[1]);
      const reps = parseInt(match1[2], 10);
      return {
        intent: 'LOG_SET',
        confidence: 0.95,
        data: { weightKg, reps, rawText: text },
      };
    }

    if (match2) {
      const weightKg = parseFloat(match2[1]);
      const reps = parseInt(match2[2], 10);
      return {
        intent: 'LOG_SET',
        confidence: 0.95,
        data: { weightKg, reps, rawText: text },
      };
    }

    // Default fallback: Pregunta al coach
    return {
      intent: 'ASK_COACH',
      confidence: 0.7,
      data: { rawText: text },
    };
  }

  /**
   * Extrae la estructura de un Valky Debrief post-entrenamiento hablado
   */
  public static parseDebriefAudioNarrative(narrative: string): ExtractedDebriefData {
    const raw = narrative.toLowerCase();

    // 1. Dificultad percibida (RPE)
    let perceivedDifficulty: 'baja' | 'media' | 'alta' | 'maxima' = 'media';
    let rpeEstimated = 7;

    if (raw.includes("pesado") || raw.includes("duro") || raw.includes("intenso") || raw.includes("agotador") || raw.includes("fallo") || raw.includes("dificil") || raw.includes("difícil")) {
      perceivedDifficulty = 'alta';
      rpeEstimated = 8.5;
    } else if (raw.includes("ligero") || raw.includes("facil") || raw.includes("fácil") || raw.includes("suave")) {
      perceivedDifficulty = 'baja';
      rpeEstimated = 5.5;
    } else if (raw.includes("maximo") || raw.includes("máximo") || raw.includes("no podia mas") || raw.includes("no podía más")) {
      perceivedDifficulty = 'maxima';
      rpeEstimated = 9.5;
    }

    // 2. Molestias reportadas
    let reportedDiscomfort: string | undefined = undefined;
    if (raw.includes("hombro")) reportedDiscomfort = "Molestia en hombro";
    else if (raw.includes("rodilla")) reportedDiscomfort = "Tensión en rodilla";
    else if (raw.includes("espalda") || raw.includes("lumbar")) reportedDiscomfort = "Carga en zona lumbar";
    else if (raw.includes("codo")) reportedDiscomfort = "Molestia en codo";
    else if (raw.includes("cuello")) reportedDiscomfort = "Sobrecarga en trapecio/cuello";

    // 3. Sueño reportado
    let sleepHoursReported: number | undefined = undefined;
    const sleepMatch = raw.match(/(\d+)\s*(?:horas?|hrs?)\s*(?:de\s*sueño|dormi|dormí)/i) || raw.match(/dormi\s*(\d+)/i);
    if (sleepMatch) {
      sleepHoursReported = parseInt(sleepMatch[1], 10);
    }

    // 4. Logros & Recuperación recomendada
    const achievements: string[] = ["Sesión de fuerza completada con constancia"];
    if (raw.includes("record") || raw.includes("récord") || raw.includes("subi peso") || raw.includes("subí peso")) {
      achievements.push("Sobrecarga progresiva exitosa");
    }

    let recoveryAction = "Hidratación con electrolitos y 30g de proteína en los próximos 60 minutos.";
    if (reportedDiscomfort) {
      recoveryAction = `Aplicar movilidad suave en ${reportedDiscomfort.toLowerCase()} y evitar ejercicios que comprometan ese rango mañana.`;
    } else if (sleepHoursReported && sleepHoursReported < 6) {
      recoveryAction = "Priorizar 8 horas de sueño esta noche para compensar el déficit de recuperación.";
    }

    return {
      summary: narrative,
      perceivedDifficulty,
      rpeEstimated,
      reportedDiscomfort,
      sleepHoursReported,
      highlightedAchievements: achievements,
      recommendedRecoveryAction: recoveryAction,
      confidence: 0.92,
    };
  }
}
