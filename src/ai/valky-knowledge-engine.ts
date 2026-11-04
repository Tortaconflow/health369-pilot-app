/**
 * Motor de Inteligencia, Acompañamiento y Respuestas Empáticas de Valky 369
 * Conecta la capa de seguridad ética ValkyGuardian con respuestas contextuales.
 */

import { ValkyGuardian } from "@/ai/guardian/guardian-policy";

interface ValkyResponseOptions {
  userQuery: string;
  goal?: string;
  energyLevel?: 'alta' | 'media' | 'baja';
}

export function getSmartValkyResponse({ userQuery, goal, energyLevel }: ValkyResponseOptions): string {
  // 0. Evaluación Previa por Valky Guardian (Seguridad de Imagen Corporal, Nutrición y Dolor)
  const guardianCheck = ValkyGuardian.evaluateQuery(userQuery);
  if (guardianCheck.guidanceMessage) {
    return guardianCheck.guidanceMessage;
  }

  const q = userQuery.toLowerCase().trim();

  // 1. Falta de ganas / Desmotivación / Pereza / Necesidad de apoyo
  if (q.includes("ganas") || q.includes("animo") || q.includes("ánimo") || q.includes("pereza") || q.includes("flojera") || q.includes("motivacion") || q.includes("motivación") || q.includes("desmotivad")) {
    return `⚡ **¡Te entiendo perfectamente! La motivación es fluctuante, pero la constancia compasiva es la clave del superhéroe.**

Aquí tienes la **Regla de los 5 Minutos de Valkyrie**:
1. Ponte tus tenis y ropa cómoda ahora mismo (solo ese micro-paso).
2. Haz 5 minutos de caminata suave o estiramientos ligeros.
3. Si tras 5 minutos sigues sin querer entrenar, te doy permiso de parar: ¡habrás cumplido tu misión y salvado tu racha de superhéroe! 🔥 *(El 90% de las veces, el cuerpo se activa y terminas la sesión).*

¿Qué te parece si hacemos solo 10 minutos de movilidad suave hoy para cuidar tus articulaciones? 🛡️`;
  }

  // 2. Dolor muscular / Agujetas / Cansancio físico
  if (q.includes("duele") || q.includes("dolor") || q.includes("agujeta") || q.includes("molestia") || q.includes("cansad") || q.includes("agota")) {
    return `🩹 **¡Ese dolor leve suele corresponder a fatiga muscular post-entrenamiento (DOMS)!**

Para recuperarte de forma óptima:
- 💧 **Hidratación profunda:** Bebe agua para restablecer el equilibrio electrolítico.
- 🚶 **Recuperación activa:** Un paseo suave de 15 minutos oxigena los tejidos y alivia la rigidez.
- 🥗 **Proteína + Descanso:** Consume tu ración de proteína y duerme al menos 7-8 horas.

¿En qué parte del cuerpo sientes más tensión hoy para sugerirte una movilidad específica?`;
  }

  // 3. Poco tiempo / Rutina Express (10-15 min)
  if (q.includes("tiempo") || q.includes("rapido") || q.includes("rápido") || q.includes("express") || q.includes("15 min") || q.includes("minutos") || q.includes("prisa")) {
    return `⚡ **¡El mejor entrenamiento es el que se adapta a tu día real! 15 minutos son infinitamente mejores que 0 minutos.**

Aquí tienes tu **Circuito Express Valkyrie (15 min en casa sin equipo)**:
Realiza 3 rondas (40 seg de trabajo / 20 seg de descanso):
1. 🦵 **Sentadillas con peso corporal:** 12 a 15 repeticiones (ritmo controlado).
2. 🛡️ **Flexiones (en suelo o con rodillas apoyadas):** 8 a 12 repeticiones.
3. 🍑 **Puente de glúteos en el suelo:** 15 repeticiones apretando 1 seg arriba.
4. 🪵 **Plancha isométrica:** 30 segundos activando abdomen y glúteos.
5. 🏃 **Jumping Jacks o trote suave en el sitio:** 40 segundos para elevar pulsaciones.

¡Al terminar ganas **+120 XP** y proteges tu racha intacta! ¿Tienes a mano agua para empezar ahora? 🔥`;
  }

  // 4. Nutrición / Qué comer post-entreno / Recetas
  if (q.includes("comer") || q.includes("receta") || q.includes("desayuno") || q.includes("cena") || q.includes("almuerzo") || q.includes("proteina") || q.includes("proteína") || q.includes("comida")) {
    return `🥗 **¡La nutrición es combustible limpio para tu rendimiento y salud! Y no necesitas platos complicados.**

Aquí tienes una **Opción Nutritiva & Rápida de la Red Valkiria**:

🥞 **Pancake Anabólico de Avena y Plátano (5 min)**:
- 🥚 2 huevos enteros + 1 clara
- 🌾 40g de copos de avena
- 🍌 1 plátano maduro machacado
- 🍯 Canela al gusto

**Valores aproximados:** ~380 kcal | 24g Proteína | 45g Carbohidratos complejos | 8g Grasas saludables.
*Tip Valkiria:* Te da energía limpia y saciedad por más de 3 horas.

¿Prefieres opciones dulces como esta o buscas ideas saladas (ej. con pollo, huevo o atún)? 🥑`;
  }

  // 5. Principiantes / Por dónde empezar / Primer día
  if (q.includes("empezar") || q.includes("iniciar") || q.includes("principiante") || q.includes("primera vez") || q.includes("novato") || q.includes("guia") || q.includes("guía")) {
    return `🌟 **¡Bienvenido/a a Valky 369! Dar el primer paso es la decisión más valiente.**

Como principiante, tu único objetivo en los primeros 14 días no es exigirte al máximo, sino **construir el hábito**:
1. 📅 **3 días por semana:** Lunes, Miércoles y Viernes es un ritmo perfecto.
2. 🎯 **Movimientos básicos:** Aprende la técnica de sentadilla y empuje antes de añadir cargas.
3. 💧 **1 Hábito de hidratación:** Empieza bebiendo 2L de agua al día e incluyendo una porción de proteína en tus comidas principales.
4. 🛡️ **Comunidad & Apoyo:** Consulta a nuestros nutricionistas certificados en la Red Valkiria cuando desees un plan clínico personalizado.

¿Quieres que te prepare una rutina de inicio suave de 3 días para hacer en casa o vas a un gimnasio? 🏋️`;
  }

  // 6. Respuesta General Inteligente
  return `⚡ **¡Excelente consulta! En Valky 369 estamos aquí para acompañarte paso a paso hacia tu mejor versión.**

Respecto a *"**${userQuery}**"*:
La clave para progresar de manera sostenible es la **simplicidad y la sobrecarga progresiva**, respetando tus tiempos de descanso y nutrición. Cada comida nutritiva y cada serie completada suma experiencia (XP) a los 6 atributos de tu superhéroe.

💡 *Consejo Valky:* Si mantienes constancia esta semana, desbloquearás el siguiente nivel de tu héroe y estarás un paso más cerca de tus metas de ${goal || "salud y bienestar"}.

¿Hay algún ejercicio o alimento específico con el que quieras que te ayude a planificar hoy? 🛡️`;
}
