# VALKY 369 — MVP ROADMAP & EXECUTION PLAN
**Plan de Implementación Progresiva, Prioridades P0-P3 y Análisis de Riesgo**  
*Fecha: Agosto 2026 | Versión: 2.0-Roadmap*

---

## 1. RESUMEN DEL MVP 1 (CORE COMPANION LOOP)

El objetivo del **MVP 1** es consolidar el ciclo diario sin fricción:

```text
DAILY CHECK-IN (Readiness)
      ↓
NEXT BEST ACTION (Hero HQ)
      ↓
LIVE WORKOUT (Voice Commands)
      ↓
VALKY DEBRIEF (Audio / Extracción Estructurada)
      ↓
GUARDIAN SAFETY CHECK
      ↓
XP & 6 STATS EVOLUTION
```

---

## 2. MATRIZ DE ROADMAP (P0 / P1 / P2 / P3)

| Prioridad | Característica / Módulo | Impacto Usuario | Esfuerzo Dev | Nivel de Riesgo | Dependencias |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P0** | **Valky Voice Intent Parser** (Extracción de `80 por 8`, `descanso 60s`, `dolor`) | 🔥 Máximo | Medio | Bajo | Web Speech API |
| **P0** | **Valky Debrief Modal & Pipeline** (Audio 15s post-entreno con confirmación estructurada) | 🔥 Máximo | Medio | Bajo | Voice Parser + Workout Tracker |
| **P0** | **Valky Guardian Interceptor** (Filtro ético de imagen corporal, no-compensación y menú emocional) | 🔥 Máximo | Bajo/Medio | Bajo | AI Knowledge Engine |
| **P1** | **Voice Control Bar en Live Workout** (Botón manos libres con feedback visual de comandos) | ⚡ Alto | Medio | Bajo | LiveWorkoutTracker |
| **P1** | **Guardián de la Racha (Streak Shield)** (Reconocer días de descanso y movilidad como racha activa) | ⚡ Alto | Bajo | Muy bajo | HeroProgressionService |
| **P2** | **Menú Emocional Interactivo** (`[Solo escúchame]`, `[Verlo diferente]`, `[Paso práctico]`) | 🎨 Medio | Bajo | Muy bajo | StructuredMessageCard |
| **P3** | **Whisper / Cloud STT & Sincronización Multi-dispositivo** | 🚀 Futuro | Alto | Medio | Backend Cloud |

---

## 3. PRIMER HITO DE IMPLEMENTACIÓN (FIRST MILESTONE)

### 🎯 **Milestone 1: Voice Intent Parser + Live Voice Logging + Valky Debrief Modal**
- **Impacto**: Permite al usuario entrenar con manos libres en el gimnasio registrando series por voz y cerrar la sesión con un debrief de 15 segundos que extrae automáticamente su esfuerzo y fatiga.
- **Riesgo**: Cero regresiones; se apoya sobre el `LiveWorkoutTracker` ya validado sin romper la interfaz táctil.
