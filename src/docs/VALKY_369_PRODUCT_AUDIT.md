# AUDITORÍA INTEGRAL DE PRODUCTO Y ARQUITECTURA: VALKY 369
**Fecha:** 18 de Agosto, 2026  
**Equipo Auditor:** Multidisciplinario Senior (Product Lead HealthTech, UX/UI Lead, Fullstack & AI Engineers, Behavioral Gamification Lead, QA & Security)

---

## 1. RESUMEN EJECUTIVO & ESTADO ACTUAL

Valky 369 cuenta con una base funcional moderna sobre **Next.js 15.2.3 (App Router)** y **React 18.3.1**, con un diseño visual oscuro pulido, branding consolidado (*Valky 369 — Código 3-6-9*) y un servidor Turbopack local activo. 

Sin embargo, el producto se encuentra en la transición crítica entre una **"suite de herramientas aisladas"** y un **"ecosistema conectado de progresión personal de superhéroe"**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             ESTADO DEL SISTEMA                              │
├───────────────────────┬─────────────────────────┬───────────────────────────┤
│       COMPLETO        │        SIMULADO         │       POR EVOLUCIONAR     │
│   (Listo en Core)     │   (Mocks / Hardcoded)   │    (Fricción o Deuda)     │
├───────────────────────┼─────────────────────────┼───────────────────────────┤
│ • AppShell & Theme    │ • Firebase DB Sync      │ • Readiness Multi-factor  │
│ • Live Workout Timer  │ • Prescripción Nutri    │ • XP Service Centralizado │
│ • AI Resilient Engine │ • Pagos Stripe/Monedas  │ • Render Markdown Chat    │
│ • Onboarding Validado │ • Photo AI Cloud        │ • Guardian de Racha Real  │
│ • Unit Tests (8/8)    │ • Perfiles Expertos     │ • Next Best Action Engine │
└───────────────────────┴─────────────────────────┴───────────────────────────┘
```

---

## 2. STACK TECNOLÓGICO Y ARQUITECTURA

- **Framework:** Next.js 15.2.3 (App Router, Turbopack, Server Actions)
- **Lenguaje:** TypeScript 5 (Strict mode)
- **UI & Estilos:** Tailwind CSS 3.4.1, Radix UI Primitives, Lucide Icons
- **IA Multimodal:** Google Genkit 1.21.0 + Gemini 2.0 Flash + `Valky Knowledge Engine` (Local Adaptive Fallback)
- **Base de Datos & Auth:** Firebase 11.8.1 (Actualmente en modo híbrido/mock local con tipados Zod en Server Actions)
- **Testing:** Jest 30.4.2 + React Testing Library (8 tests unitarios de Onboarding/Boundary passing)

---

## 3. AUDITORÍA DETALLADA POR MÓDULOS

### A. Valky AI Coach (`/ai-chat`)
- **Estado Actual:** Chat conversacional con selector de 3 niveles de energía (`EnergyCheckInCard`), cuestionario guiado de objetivos y centro de notificaciones y recordatorios.
- **Funcionalidad Completa:** Conexión Server Action con fallback resiliente offline (0 caídas de servidor).
- **Problema UX & Deuda:** 
  - La respuesta a veces muestra markdown crudo si no se renderiza con un parser visual estructurado.
  - El selector de energía es estático; debe evolucionar hacia un indicador de **Hero Readiness Score (%)** multi-factor (sueño + fatiga + actividad previa).
  - La IA debe actuar como **Agente con Herramientas** (`modifyWorkoutIntensity`, `logWater`, `logStreak`).

### B. Live Workout Engine (`/workouts`)
- **Estado Actual:** Vista de biblioteca (Gimnasio, Casa, Máquinas) y reproductor en vivo (`LiveWorkoutTracker`) con temporizador de descanso.
- **Funcionalidad Completa:** Registro por series, cuenta regresiva de descanso configurable (30-120s) y cálculo de XP.
- **Problema UX & Deuda:**
  - Los inputs de peso/reps son fijos en la UI actual en lugar de una tabla interactiva editable por serie con RPE opcional.
  - Al terminar, la pantalla de resultados no actualiza todavía de forma persistente el estado global del héroe en el perfil.

### C. Hero HQ & Perfil RPG (`/dashboard` y `/profile`)
- **Estado Actual:** Dashboard con status del héroe, misiones diarias y plan nutricional. Perfil con `VisualHeroCanvas` y senda de rangos.
- **Funcionalidad Completa:** Visualización de 6 atributos (STR, END, VIT, AGI, MND, REC) y auras visuales según nivel.
- **Problema UX & Deuda:**
  - Falta el **Next Best Action Engine** en el Dashboard para responder en 3 segundos: *"¿Cómo estoy?", "¿Qué hago ahora?" y "¿Qué progreso hice?"*.
  - El cálculo de XP está distribuido en componentes locales en lugar de un `XPService` centralizado con protección antifarming.

### D. Red Valkiria & Nutrición (`/experts` y `/experts/[id]`)
- **Estado Actual:** Directorio con cards de especialistas y `BookingModal` para agendamiento de videoconsultas.
- **Funcionalidad Simulada:** Las reservas generan toasts y confirmaciones locales sin persistencia en calendario o base de datos.

### E. Desafíos & Leaderboard (`/challenges`)
- **Estado Actual:** Grid de desafíos, pozo de monedas y tabla de clasificación en vivo (`LiveLeaderboardCard`).
- **Funcionalidad Simulada:** Los participantes y fotos verificadas son mocks de alta fidelidad.

---

## 4. PRIORIDADES DE IMPLEMENTACIÓN (P0 / P1 / P2 / P3)

| Prioridad | Módulo / Tarea | Impacto | Complejidad | Justificación |
| :--- | :--- | :--- | :--- | :--- |
| **P0 (Crítico)** | **XPService Centralizado & Persistencia de Estado del Héroe** | 🔥 Máximo | Media | Es el motor del core loop: si completar un entreno no actualiza los stats reales, se rompe la gamificación. |
| **P0 (Crítico)** | **Next Best Action Engine en Hero HQ (`/dashboard`)** | 🔥 Máximo | Baja/Media | Da respuesta en 3 segundos a "¿Qué hago ahora?" reduciendo la fricción al entrar. |
| **P1 (Importante)** | **Hero Readiness Score & Respuestas Estructuradas en Coach (`/ai-chat`)** | ⚡ Alto | Media | Transforma el chat de un muro de texto a tarjetas interactivas de recuperación con chips de acción rápida. |
| **P1 (Importante)** | **Live Workout Table Editable con Registro de Series, Peso y RPE** | ⚡ Alto | Media | Permite al usuario anotar sus cargas reales en cada serie de forma ultrarrápida. |
| **P1 (Importante)** | **Guardián de la Racha Inteligente (Protección anti-toxicidad)** | ⚡ Alto | Baja | Salva la racha con misiones express de 10 min o movilidad cuando no hay tiempo. |
| **P2 (Mejora)** | **Radar Chart Visual Interactivo de 6 Atributos en Profile** | 🎨 Medio | Baja | Claridad visual del balance entre STR, END, VIT, AGI, MND y REC. |
| **P2 (Mejora)** | **Sistema de Misiones Diarias Adaptativas (3-5 max)** | 🎨 Medio | Media | Conexión directa entre check-in, entreno y nutrición. |
| **P3 (Futuro)** | **Persistencia Cloud Firestore & Sincronización Multi-dispositivo** | 🚀 Futuro | Alta | Sincronización en la nube tras validar el core loop localmente. |

---

## 5. PRIMER CAMBIO RECOMENDADO: MAYOR IMPACTO Y MENOR RIESGO

### 🎯 **Fase 1 Quick-Win: Centralización de `XPService` + Next Best Action Engine en Hero HQ**
- **Por qué:** Conecta inmediatamente el entrenamiento en vivo, el check-in diario y las misiones con la evolución real del avatar del héroe, cerrando el ciclo:
  **Entrada → Estado del Héroe → Acción Recomendada → Registro de Series → +XP persistente → Evolución visible.**
- **Riesgo:** Prácticamente cero (no toca dependencias externas ni rompe rutas existentes).
