'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot, Loader2, Rocket, Activity, Mic, Bell } from 'lucide-react';
import { handleRecipeChat } from '@/app/actions/chatActions';
import { handleGenerateWorkoutAction } from '@/app/actions/workoutActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroReadinessGauge } from '@/components/ai/HeroReadinessGauge';
import { StructuredMessageCard } from '@/components/ai/StructuredMessageCard';
import { ValkyNotificationCenter } from '@/components/notifications/ValkyNotificationCenter';
import { HeroService } from '@/services/heroService';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { AudioWaveform } from '@/components/voice/AudioWaveform';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface QuestionnaireQuestion {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  key: keyof UserPreferences;
}

interface UserPreferences {
  objective?: string;
  experience?: string;
  recipePreference?: string;
  wearable?: string;
  timeAvailablePerSession?: string;
  daysPerWeek?: number;
  limitations?: string[];
  preferredStyle?: string;
  availableEquipment?: string[];
  averageSleepHours?: number;
  restingHeartRate?: number;
  recentActivitySummary?: string;
  stressLevel?: 'bajo' | 'medio' | 'alto';
}

const questionnaireQuestions: QuestionnaireQuestion[] = [
  {
    id: 'q1',
    text: '¿Cuál es tu objetivo principal?',
    options: [
      { value: 'perder_grasa', label: 'Perder grasa y tonificar' },
      { value: 'ganar_musculo', label: 'Ganar masa muscular y fuerza' },
      { value: 'salud_general', label: 'Crear el hábito y sentirme con energía' },
      { value: 'rendimiento', label: 'Mejorar resistencia y agilidad' },
    ],
    key: 'objective',
  },
  {
    id: 'q2',
    text: '¿Cuál es tu experiencia con el ejercicio?',
    options: [
      { value: 'principiante', label: 'Completamente nuevo / Empezando desde cero' },
      { value: 'intermedio', label: 'He entrenado antes pero perdí la constancia' },
      { value: 'avanzado', label: 'Entreno regularmente y busco optimizar' },
    ],
    key: 'experience',
  },
  {
    id: 'q3',
    text: '¿Cuánto tiempo tienes para entrenar por sesión?',
    options: [
      { value: '15-20_min', label: '15 - 20 minutos (Express)' },
      { value: '30-45_min', label: '30 - 45 minutos (Ideal)' },
      { value: '60_min', label: '60 minutos o más' },
    ],
    key: 'timeAvailablePerSession',
  },
  {
    id: 'q4',
    text: '¿Prefieres entrenar en casa o en gimnasio?',
    options: [
      { value: 'casa_sin_equipo', label: 'En casa (sin equipo)' },
      { value: 'casa_con_mancuernas', label: 'En casa (con mancuernas/bandas)' },
      { value: 'gimnasio', label: 'En gimnasio completo' },
    ],
    key: 'preferredStyle',
  },
];

const beginnerQuickPrompts = [
  { label: "⚡ No tengo ganas hoy", query: "Hoy no tengo muchas ganas de entrenar ni motivación, ¿qué me recomiendas para no romper mi racha?" },
  { label: "🩹 Tengo dolor muscular", query: "Ayer entrené y hoy me duelen los músculos (agujetas), ¿debo descansar o qué puedo hacer?" },
  { label: "⏱️ Rutina Express 15 min", query: "Solo tengo 15 minutos hoy para entrenar en casa sin equipo, ¿me das un circuito rápido?" },
  { label: "🍗 Qué comer post-entreno", query: "¿Qué puedo comer fácil y rápido después de entrenar para nutrir a mi superhéroe?" },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [isQuestionnaireActive, setIsQuestionnaireActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false);
  const [showGenerateWorkoutButton, setShowGenerateWorkoutButton] = useState(false);

  const {
    isListening,
    transcript: spokenTranscript,
    audioLevel,
    startListening,
    stopListening,
    error: speechError,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    onResult: (finalText, interim) => {
      setInput(finalText || interim);
    },
  });

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
      toast({
        title: "🎙️ Escuchando...",
        description: "Habla claramente al micrófono.",
        className: "bg-primary text-primary-foreground font-bold",
      });
    }
  };

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'init-bot-welcome',
      role: 'assistant',
      content: '¡Hola! Soy **Valky AI Coach**, tu compañero empático de transformación física. Tu preparación de hoy está calculada. ¿En qué te puedo acompañar hoy? Puedes preguntarme sobre nutrición, técnica, o cómo adaptar tu sesión si tienes dolor muscular.',
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleStartQuestionnaire = () => {
    setIsQuestionnaireActive(true);
    setCurrentQuestionIndex(0);
    setUserPreferences({});
    setIsQuestionnaireComplete(false);
    setShowGenerateWorkoutButton(false);
    setMessages([]);
  };

  const handleQuestionnaireResponse = (key: keyof UserPreferences, value: string, label: string) => {
    const updatedPreferences = { ...userPreferences, [key]: value };
    setUserPreferences(updatedPreferences);

    const userReplyMessage: ChatMessage = {
      id: `user-q-ans-${currentQuestionIndex}`,
      role: 'user',
      content: label,
    };
    setMessages((prev) => [...prev, userReplyMessage]);

    if (currentQuestionIndex < questionnaireQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuestionnaireActive(false);
      setIsQuestionnaireComplete(true);
      
      HeroService.awardAction('daily_checkin', {
        xp: 50,
        mnd: 3,
        message: "Cuestionario de Metas Completado",
      });

      const readyMessage: ChatMessage = {
        id: 'bot-q-complete',
        role: 'assistant',
        content: `⚡ **¡Perfil de Superhéroe Configurado con Éxito (+50 XP)!**\n\nHe registrado tus metas: **${updatedPreferences.objective}** (${updatedPreferences.experience}).\n\n¿Quieres que preparemos tu primera propuesta de entrenamiento personalizado ahora mismo?`,
      };
      setMessages((prev) => [...prev, readyMessage]);
      setShowGenerateWorkoutButton(true);
      toast({
        title: "¡Perfil de Superhéroe Listo!",
        description: "+50 XP ganados para tu cuenta.",
        className: "bg-primary text-primary-foreground font-bold",
      });
    }
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, promptedQuery?: string) => {
    if (e) e.preventDefault();
    setShowGenerateWorkoutButton(false);

    const query = promptedQuery || input.trim();
    if (!query || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    let currentInputForAPI = query;
    if (!promptedQuery) setInput('');
    setIsLoading(true);

    const chatHistoryForAPI = messages
      .filter(msg => !['init-bot-welcome', 'init-bot-ready', 'bot-q-complete'].includes(msg.id) && !msg.id.startsWith('user-q-ans-'))
      .map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const result = await handleRecipeChat({ 
        userQuery: currentInputForAPI, 
        chatHistory: chatHistoryForAPI,
        userContext: { goal: userPreferences.objective }
      });

      if (result.success && result.data) {
        const newAssistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.data.aiResponse,
        };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
      }
    } catch (error: any) {
      console.error("Error en chat:", error);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  const handleGenerateWorkoutPlan = async () => {
    setIsLoading(true);
    setShowGenerateWorkoutButton(false);

    const requestingMessage: ChatMessage = {
      id: `user-req-workout-${Date.now()}`,
      role: 'user',
      content: '¡Sí, genera mi plan de entrenamiento de superhéroe personalizado!',
    };
    setMessages((prev) => [...prev, requestingMessage]);

    try {
      const result = await handleGenerateWorkoutAction({
        goals: [userPreferences.objective || 'ganar_musculo'],
        fitnessLevel: (userPreferences.experience as any) || 'principiante',
        timeAvailablePerSession: userPreferences.timeAvailablePerSession || '30-45_min',
        daysPerWeek: 3,
        preferredStyle: 'funcional',
      });

      if (result.success && result.data) {
        const plan = result.data;
        let formattedRoutine = `⚡ **${plan.planName}**\n\n`;
        formattedRoutine += `${plan.overview}\n\n`;
        formattedRoutine += `### 🏋️ Rutina de Ejercicios:\n`;

        plan.schedule.forEach((item, idx) => {
          formattedRoutine += `\n**${idx + 1}. ${item.day} - ${item.focus}**\n`;
          item.exercises.forEach((ex) => {
            formattedRoutine += `- **${ex.name}**: ${ex.sets} series x ${ex.reps} (${ex.rest} descanso). *${ex.tips || ''}*\n`;
          });
        });

        formattedRoutine += `\n🎯 **Estrategia:** ${plan.progressionStrategy}\n`;
        formattedRoutine += `\n🥗 **Nutrición:** ${plan.nutritionGuidelines}\n`;

        const assistantMessage: ChatMessage = {
          id: `assistant-workout-${Date.now()}`,
          role: 'assistant',
          content: formattedRoutine,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        HeroService.awardAction('workout_completed', {
          xp: 100,
          str: 2,
          end: 1,
          message: "Rutina generada por IA",
        });

        toast({
          title: "¡Rutina Generada con Éxito (+100 XP)!",
          description: "Tu plan de entrenamiento personalizado ha sido creado.",
          className: "bg-primary text-primary-foreground font-bold",
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-0 max-w-5xl space-y-6">
      {/* Top Tabs: Coach vs Notification Center */}
      <Tabs defaultValue="coach" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-card/80 border border-border/50 p-1 rounded-xl mb-4">
          <TabsTrigger value="coach" className="gap-2 font-bold text-xs">
            <Bot className="h-4 w-4 text-primary" /> Valky AI Coach
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 font-bold text-xs">
            <Bell className="h-4 w-4 text-amber-400" /> Recordatorios & Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Coach Conversacional */}
        <TabsContent value="coach" className="space-y-4">
          {/* Daily Readiness & Multi-Factor Gauge */}
          <HeroReadinessGauge />

          <Card className="w-full shadow-2xl flex flex-col h-[650px] rounded-2xl border-border/60 bg-card/90 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-border/20 py-3 px-6 bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground font-black">V</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-black text-foreground">
                    Valky AI Coach
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    Coach adaptativo con respuestas estructuradas
                  </p>
                </div>
              </div>

              {!isQuestionnaireActive && (
                <Button onClick={handleStartQuestionnaire} size="sm" variant="outline" className="text-xs font-bold border-border/50">
                  <Rocket className="h-3.5 w-3.5 mr-1.5 text-primary" /> {isQuestionnaireComplete ? "Reconfigurar Metas" : "Iniciar Cuestionario"}
                </Button>
              )}
            </CardHeader>

            {/* Questionnaire View */}
            {isQuestionnaireActive && currentQuestionIndex < questionnaireQuestions.length && (
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-center max-w-xl mx-auto">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider text-center block">
                  Paso {currentQuestionIndex + 1} de {questionnaireQuestions.length}
                </span>
                <p className="text-lg font-extrabold text-center text-foreground">
                  {questionnaireQuestions[currentQuestionIndex].text}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {questionnaireQuestions[currentQuestionIndex].options.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="outline"
                      className="h-auto py-3.5 px-4 justify-center text-center text-xs font-bold hover:bg-primary/10 hover:border-primary border-border/60 rounded-xl"
                      onClick={() => handleQuestionnaireResponse(questionnaireQuestions[currentQuestionIndex].key, opt.value, opt.label)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}

            {/* Main Chat Stream with StructuredMessageCard */}
            <CardContent className={cn("p-0 flex-1 overflow-hidden", isQuestionnaireActive && "hidden")}>
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div ref={viewportRef} className="h-full p-4 md:p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-3 max-w-2xl",
                        message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border">
                        {message.role === 'user' ? (
                          <AvatarFallback className="bg-muted text-foreground text-xs font-bold">TÚ</AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">V</AvatarFallback>
                        )}
                      </Avatar>
                      
                      <StructuredMessageCard
                        content={message.content}
                        role={message.role}
                        onQuickReply={(pill) => handleSubmit(undefined, pill)}
                      />
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0 border border-primary/30">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">V</AvatarFallback>
                      </Avatar>
                      <div className="p-3 rounded-2xl bg-muted/60 border border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" /> Valky AI está analizando la mejor recomendación...
                      </div>
                    </div>
                  )}

                  {showGenerateWorkoutButton && !isLoading && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                      <p className="text-xs font-bold text-foreground">¿Listo para que cree tu rutina completa personalizada?</p>
                      <Button onClick={handleGenerateWorkoutPlan} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs shadow-md">
                        <Rocket className="h-4 w-4 mr-1.5" /> Generar Rutina Personalizada (+100 XP)
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Quick Action Chips for Beginners */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border/20 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> Sugerencias Rápidas:
              </span>
              {beginnerQuickPrompts.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(undefined, chip.query)}
                  disabled={isLoading}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-background/80 hover:bg-primary/15 hover:border-primary/40 border border-border/50 transition-colors text-foreground"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input Footer */}
            <CardFooter className="p-3 border-t border-border/20 bg-background/90">
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregúntale a Valky AI (ej: 'No tengo ganas hoy', 'Receta con huevo', 'Rutina de 15 min')..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-muted/40 border-border/60 text-xs md:text-sm py-5"
                />
                <AudioWaveform isListening={isListening} audioLevel={audioLevel} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  className={cn("rounded-xl shrink-0 h-10 w-10", isListening && "border-rose-500 bg-rose-500/10 text-rose-500")}
                  title="Dictar por voz"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shrink-0 h-10 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 2: Centro de Notificaciones & Recordatorios */}
        <TabsContent value="notifications" className="space-y-4">
          <ValkyNotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}