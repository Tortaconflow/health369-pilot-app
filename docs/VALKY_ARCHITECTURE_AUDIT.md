# VALKY 369 — ARCHITECTURE AUDIT & CODEBASE MAPPING
**Documento de Auditoría Técnica y Arquitectura de Dominio**  
*Fecha: Agosto 2026 | Versión: 2.0-Audit*

---

## 1. ARQUITECTURA ACTUAL & STACK

- **Framework**: Next.js 15.2.3 (App Router, Turbopack, React Server Components & Server Actions)
- **Runtime**: React 18.3.1
- **Lenguaje**: TypeScript 5 (Strict Mode)
- **Estilos & UI**: Tailwind CSS 3.4.1, Radix UI Primitives, Lucide Icons, CSS Custom Properties HSL
- **IA & Orquestación**: Google Genkit 1.21.0 + Gemini 2.0 Flash + `Valky Knowledge Engine` (Local Adaptive Fallback Offline-First)
- **Persistencia**: LocalStorage reactivo con CustomEvent Bus (`valky_hero_updated`) + Firebase 11.8.1 Client SDK en dependencias
- **Testing**: Jest 30.4.2 + React Testing Library + JSDOM (8 tests pasando)

---

## 2. INVENTARIO DE COMPONENTES: REUSE, REFACTOR, REPLACE, NEW

| Componente / Módulo | Ubicación | Estado | Veredicto | Acción Planificada |
| :--- | :--- | :--- | :--- | :--- |
| **AppShell & Navigation** | `src/components/layout/AppShell.tsx` | Estable | **REUSE** | Mantener navegación híbrida (Sidebar Desktop + Bottom Bar Mobile). |
| **NextBestActionCard** | `src/components/dashboard/NextBestActionCard.tsx` | Estable | **REFACTOR** | Conectar con el orquestador agéntico multi-estado. |
| **HeroReadinessHeader** | `src/components/dashboard/HeroReadinessHeader.tsx` | Estable | **REUSE** | Muestra Readiness 84% e identidad del héroe en 3s. |
| **LiveWorkoutTracker** | `src/components/workouts/LiveWorkoutTracker.tsx` | Estable | **REFACTOR** | Añadir soporte para Voice Logging (`VoiceIntent.LOG_SET`) y trigger a Valky Debrief. |
| **HeroReadinessGauge** | `src/components/ai/HeroReadinessGauge.tsx` | Estable | **REUSE** | Selector de 3 modos (Alta / Normal / Baja) sin culpa. |
| **StructuredMessageCard**| `src/components/ai/StructuredMessageCard.tsx` | Estable | **REUSE** | Renderiza chips de recuperación y pills interactivas. |
| **VisualHeroCanvas** | `src/components/gamification/VisualHeroCanvas.tsx` | Estable | **REUSE** | Auras dinámicas y radar de 6 atributos sincronizado. |
| **DailyQuestsCard** | `src/components/gamification/DailyQuestsCard.tsx` | Estable | **REUSE** | Conectado a `HeroService.awardAction`. |
| **HeroService** | `src/services/heroService.ts` | Estable | **REFACTOR** | Convertir en `HeroProgressionService` con antifarming estricto y REC rewards. |
| **Valky Debrief Module** | `src/components/workouts/ValkyDebriefModal.tsx` | No existe | **NEW** | Modal de audio/texto post-entreno con extracción estructurada. |
| **VoiceIntent Engine** | `src/ai/voice/voice-intent-parser.ts` | No existe | **NEW** | Parser de intenciones y entidades (kg, reps, dolor, comandos). |
| **Valky Guardian Engine**| `src/ai/guardian/guardian-policy.ts` | No existe | **NEW** | Capa transversal de seguridad emocional, nutricional y física. |

---

## 3. DEUDA TÉCNICA & RIESGOS DETECTADOS

1. **Acoplamiento Directo al Web Speech API**: Actualmente la voz en `/ai-chat` usa directamente `window.SpeechRecognition`. Debe crearse una abstracción `SpeechProvider` para permitir en el futuro alternar con Whisper, Gemini Multimodal Live o Cloud STT.
2. **Ausencia de Pipeline de Debrief Estructurado**: Al terminar un entrenamiento, se cierra el tracker sin capturar las sensaciones subjetivas (fatiga, dolor articular, percepción de esfuerzo RPE).
3. **Falta de Políticas de Guardian Formales**: No existía una capa interceptora antes y después de los prompts de la IA que bloqueara activamente lenguaje dañino de TCA o dismorfia.

---

## 4. ARQUITECTURA OBJETIVO DEL SISTEMA COMPANION

```text
src/
├── ai/
│   ├── flows/                 # Flujos Genkit Server Actions
│   ├── guardian/              # Valky Guardian (Policies & Interceptors)
│   ├── voice/                 # SpeechProvider, VoiceIntent Parser, Debrief Extractor
│   ├── orchestrator.ts        # Valky Agent Orchestrator (Intent -> Tool -> Action)
│   └── valky-knowledge-engine.ts
├── services/
│   ├── heroProgressionService.ts # XP, Nivel, 6 Atributos, Antifarming
│   ├── workoutService.ts         # Live Tracker, Sets, Volumen, Historial
│   └── recoveryService.ts        # Readiness, Sueño, Racha Inteligente
├── components/
│   ├── ai/                    # Readiness, Structured Messages, Coach UI
│   ├── voice/                 # Voice Control Bar, Valky Debrief Modal
│   ├── guardian/              # Emotional Support Cards, Safety Alerts
│   ├── dashboard/             # Next Best Action, Hero HQ
│   └── workouts/              # Live Table, Rest Timer
└── types/
    └── companion.ts           # Tipos de VoiceIntent, Debrief, Guardian
```
