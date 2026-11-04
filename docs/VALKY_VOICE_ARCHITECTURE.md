# VALKY 369 — VOICE ARCHITECTURE & DEBRIEF PIPELINE
**Especificación de Arquitectura de Voz, Interfaz Hands-Free y Debriefing**  
*Fecha: Agosto 2026 | Versión: 2.0-Voice*

---

## 1. OBJETIVO & FILOSOFÍA DE VOZ

En el contexto real del gimnasio o entrenamiento en casa, la fricción táctil es el mayor enemigo de la adherencia. El usuario tiene las manos sudadas, sostiene mancuernas y está físicamente fatigado. 

**Valky Voice** convierte la voz en una interfaz natural sin fricción, dividiendo las interacciones en 4 modos funcionales:
1. `COMMAND` (Acciones directas en el tracker: *"80 por 8"*, *"Siguiente"*, *"Descanso 90s"*).
2. `OBSERVATION` (Reporte de sensaciones: *"Sentí un pinchazo en el hombro"*).
3. `QUESTION` (Preguntas directas de técnica o nutrición).
4. `REFLECTION` (Desahogo o frustración: *"Siento que no avanzo"*).

---

## 2. ABSTRACCIÓN `SpeechProvider` (Desacoplamiento)

```typescript
export interface SpeechProvider {
  isAvailable(): boolean;
  startListening(options: SpeechListenOptions): void;
  stopListening(): void;
  speak(text: string, options?: SpeechSynthesizeOptions): Promise<void>;
  onResult(callback: (transcript: string, isFinal: boolean) => void): void;
  onError(callback: (error: string) => void): void;
}
```
*Implementación inicial:* `WebSpeechProvider` (nativo en navegadores modernos), lista para conectarse a Whisper API o Gemini Live Multimodal sin cambiar la lógica de la app.

---

## 3. MOTOR DE INTENCIONES (`VoiceIntent`)

```typescript
export type VoiceIntentType =
  | 'LOG_SET'
  | 'START_REST'
  | 'SKIP_REST'
  | 'NEXT_EXERCISE'
  | 'PREVIOUS_EXERCISE'
  | 'REPLACE_EXERCISE'
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
```

### Ejemplos de Extracción:
- *"80 por 8"* 👉 `LOG_SET { weightKg: 80, reps: 8 }` (Optimistic Logging automático)
- *"Descanso 2 minutos"* 👉 `START_REST { restSeconds: 120 }`
- *"Me dolió el hombro izquierdo"* 👉 `REPORT_PAIN { bodyPart: "hombro izquierdo" }` (Requiere confirmación interactiva)
- *"Siguiente ejercicio"* 👉 `NEXT_EXERCISE`

---

## 4. FUNCIÓN PRIORITARIA: VALKY DEBRIEF PIPELINE

Al finalizar el entrenamiento, se activa la experiencia **Valky Debrief**:
1. El usuario presiona el micrófono y habla 15-30s: *"Estuvo pesado, saqué 80 por 8 en la banca y 70 por 10 en militar, pero me molestó un poco la rodilla en sentadilla y dormí poco"*.
2. **Audio Ephemeral by Default**: El audio se transcribe, se extraen las entidades estructuradas y el stream de audio se destruye inmediatamente.
3. Se presentan tarjetas estructuradas editables:
   - 🏋️ **Series registradas**: Bench Press (80kg × 8), Press Militar (70kg × 10).
   - ⚡ **Dificultad Percibida**: Alta (RPE 9).
   - 🩹 **Molestia Detectada**: Rodilla (Se añade nota de recuperación para mañana).
4. El usuario confirma con 1 tap y se actualiza el `HeroProgressionService` otorgando XP y ajustando el *Next Best Action* de mañana.
