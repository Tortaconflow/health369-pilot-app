import { GuardianEvaluation, EmotionalNeedType } from "@/types/companion";

export class ValkyGuardian {
  /**
   * Evalúa la consulta del usuario para detectar banderas rojas o patrones potencialmente perjudiciales
   */
  public static evaluateQuery(userQuery: string): GuardianEvaluation {
    const raw = userQuery.toLowerCase().trim();

    // 1. Detección de Dolores Agudos / Banderas Rojas Fisioterapéuticas
    if (raw.includes("dolor insoportable") || raw.includes("pinchazo agudo") || raw.includes("se me durmio") || raw.includes("se me durmió") || raw.includes("crujido fuerte") || raw.includes("dolor de pecho") || raw.includes("dificultad para respirar") || raw.includes("mareo intenso")) {
      return {
        riskLevel: 'ESCALATE',
        category: 'acute_pain',
        isRedFlag: true,
        guidanceMessage: "⚠️ **Señal de Alerta Detectada**: Tu seguridad es lo primero. Por favor, detén el entrenamiento inmediatamente. Este tipo de síntoma requiere valoración por un profesional de la salud o fisioterapeuta.",
        suggestedAction: "Detener sesión y consultar especialista",
      };
    }

    // 2. Detección de Restricción Extrema / Compensación / TCA
    if (raw.includes("quema lo que comi") || raw.includes("quemar lo que comí") || raw.includes("castigarme") || raw.includes("no comer nada") || raw.includes("ayunar 3 dias") || raw.includes("culpa por comer") || raw.includes("vomitar")) {
      return {
        riskLevel: 'HIGH_CONCERN',
        category: 'eating_restriction',
        isRedFlag: true,
        guidanceMessage: "🛡️ **Principio Valkyrie**: En Valky 369 la comida es **energía y combustible para tu superhéroe**, nunca un castigo ni algo que debas 'ganarte'. El progreso real se construye nutriendo tu cuerpo con regularidad, no castigándolo con restricciones extremas.",
        suggestedAction: "Reencuadre nutricional positivo",
      };
    }

    // 3. Detección de Comparación Corporal Destructiva / Dismorfia
    if (raw.includes("odio mi cuerpo") || raw.includes("quiero el cuerpo de") || raw.includes("me veo horrible") || raw.includes("no sirvo para nada")) {
      return {
        riskLevel: 'CAUTION',
        category: 'body_image',
        isRedFlag: false,
        guidanceMessage: "🌟 **Recordatorio del Héroe**: Las redes sociales muestran imágenes con iluminación perfecta, poses estudiadas y años de preparación específica. Tu valor y tu transformación se miden contra tu propia constancia, no contra ideales ajenos. Cada paso que das hoy ya te hace más fuerte.",
        suggestedAction: "Acompañamiento compasivo",
      };
    }

    // 4. Detección de Fatiga Emocional o Frustración
    if (raw.includes("no puedo mas") || raw.includes("no puedo más") || raw.includes("quiero rendirme") || raw.includes("no tengo fuerzas") || raw.includes("llevo semanas sin avanzar")) {
      return {
        riskLevel: 'CAUTION',
        category: 'emotional_fatigue',
        isRedFlag: false,
        guidanceMessage: "🫂 **Estoy aquí contigo**: Los estancamientos y los días difíciles son parte normal de la biología humana. La disciplina no es exigirse el 100% todos los días, sino saber adaptarse cuando la energía es baja.",
        suggestedAction: "Ofrecer Menú de Necesidades Emocionales",
      };
    }

    return {
      riskLevel: 'NORMAL',
      isRedFlag: false,
    };
  }

  /**
   * Genera la respuesta empática según la necesidad emocional elegida por el usuario
   */
  public static handleEmotionalNeed(need: EmotionalNeedType): string {
    switch (need) {
      case 'just_listen':
        return `👂 **Te escucho con total atención.**
No voy a darte rutinas ni consejos técnicos en este momento. Tómate el tiempo que necesites para desahogarte; aquí tienes un espacio seguro. ¿Qué ha sido lo más pesado de tu día?`;

      case 'reframe_perspective':
        return `🔄 **Miremos esto desde otra perspectiva:**
A veces sentimos que no avanzamos porque esperamos cambios radicales cada semana. Pero tu cuerpo está adaptando tendones, densidad ósea, mitocondrias y hábitos neuronales. Esos cimientos invisibles son los que sostienen al superhéroe. ¿Qué pequeño hábito sí has mantenido últimamente?`;

      case 'actionable_step':
        return `🎯 **Hagamos un micro-paso sin presión:**
Cuando la mente está abrumada, la mejor estrategia es reducir el objetivo al mínimo viable:
1. Bebe un vaso de agua fresca.
2. Haz 3 respiraciones profundas diafragmáticas.
3. Si hoy no entrenas pesado, daremos un paseo suave de 10 min para oxigenar tu mente.
¿Te parece bien dar ese primer paso ahora?`;
    }
  }
}
