
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot, Loader2, Rocket, Activity, Mic, Volume2, AlertTriangle } from 'lucide-react';
import { handleRecipeChat } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription as AlertDescriptionComponent } from '@/components/ui/alert';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface QuestionnaireQuestion {
  id:string;
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
  // Campos añadidos para datos biométricos
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
      { value: 'ganar_masa_muscular', label: 'Ganar masa muscular' },
      { value: 'perder_peso', label: 'Perder peso' },
      { value: 'recomponer_cuerpo', label: 'Recomponer mi cuerpo' },
      { value: 'mantener_peso', label: 'Mantener mi peso' },
    ],
    key: 'objective',
  },
  {
    id: 'q2',
    text: '¿Tienes experiencia con dietas o entrenamientos?',
    options: [
      { value: 'avanzado', label: 'Sí, soy experto/a' },
      { value: 'intermedio', label: 'Algo de experiencia' },
      { value: 'principiante', label: 'Ninguna' },
    ],
    key: 'experience',
  },
  {
    id: 'q3',
    text: '¿Prefieres recetas que sean principalmente...?',
    options: [
      { value: 'rapidas', label: 'Rápidas' },
      { value: 'saludables', label: 'Saludables' },
      { value: 'altas_proteinas', label: 'Altas en proteínas' },
      { value: 'todas', label: 'Una mezcla de todo' },
    ],
    key: 'recipePreference',
  },
  {
    id: 'q4',
    text: '¿Usas algún wearable (reloj inteligente, pulsera de actividad) para medir tu progreso?',
    options: [
      { value: 'si', label: 'Sí' },
      { value: 'no', label: 'No' },
    ],
    key: 'wearable',
  },
];

const suggestedPrompts = [
    "¿Te gustaría una receta para ganar masa muscular?",
    "¿Necesitas consejos para medir tu progreso?",
    "¿Quieres saber cómo ajustar tu dieta según tu actividad?",
    "Dame una idea para una cena saludable y rápida."
];

const WORKOUT_GENERATION_PROMPT_KEYPHRASE_ES = "¿quieres que procedamos a generar una propuesta de entrenamiento personalizada para ti?";
const WORKOUT_GENERATION_PROMPT_KEYPHRASE_EN = "would you like us to proceed with generating a personalized training proposal for you?";


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

  const [isListening, setIsListening] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setBrowserSupportsSpeech(false);
      toast({
        title: "Navegador no compatible",
        description: "Tu navegador no es compatible con el reconocimiento o síntesis de voz.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error('Error de reconocimiento de voz:', event.error);
      setIsListening(false);
      let errorMessage = "Ocurrió un error durante el reconocimiento de voz.";
      if (event.error === 'no-speech') errorMessage = "No se detectó voz. Inténtalo de nuevo.";
      else if (event.error === 'audio-capture') errorMessage = "No se pudo capturar el audio. Revisa tu micrófono.";
      else if (event.error === 'not-allowed') errorMessage = "Permiso para usar el micrófono denegado.";
      toast({ title: "Error de Voz", description: errorMessage, variant: "destructive" });
    };
    recognition.onend = () => setIsListening(false);
    speechRecognitionRef.current = recognition;

    utteranceRef.current = new SpeechSynthesisUtterance();
    utteranceRef.current.lang = 'es-ES';
    utteranceRef.current.rate = 0.9;

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, [toast]);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!isQuestionnaireComplete && messages.length === 0) {
         setMessages([
            { id: 'init-bot-welcome', role: 'assistant', content: '¡Hola! Soy NutriChef AI, tu coach de fitness entusiasta. Para ayudarte mejor, ¿te gustaría responder unas breves preguntas?' }
         ]);
    } else if (isQuestionnaireComplete && messages.length === 0) {
         setMessages([
            { id: 'init-bot-ready', role: 'assistant', content: '¡Hola de nuevo! Gracias por tus respuestas. ¿En qué receta, idea de comida saludable o plan de entrenamiento puedo ayudarte hoy? 💪' }
         ]);
    }
  }, [isQuestionnaireComplete, messages.length]);

  const handleStartQuestionnaire = () => {
    setIsQuestionnaireActive(true);
    setShowGenerateWorkoutButton(false);
    // No añadir "Sí, quiero responder las preguntas" al historial.
    // Simplemente avanzar al cuestionario.
  };

  const handleQuestionnaireResponse = (questionKey: keyof UserPreferences, answerValue: string, answerLabel: string) => {
    setUserPreferences(prev => ({ ...prev, [questionKey]: answerValue }));
    setMessages(prev => [...prev, {id: `user-q-ans-${questionKey}-${Date.now()}`, role: 'user', content: answerLabel}]);

    if (currentQuestionIndex < questionnaireQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuestionnaireActive(false);
      setIsQuestionnaireComplete(true);
      const completeMessage = '¡Genial! Tus preferencias han sido guardadas para esta sesión. ¿Listo/a para planificar algo increíble juntos? 🚀';
      setMessages(prev => [...prev, {id: 'bot-q-complete', role: 'assistant', content: completeMessage}]);
      speakText(completeMessage);
      toast({
        title: "Cuestionario Completo",
        description: "Tus preferencias están listas. ¡Vamos a ello!",
        className: "bg-green-500 text-white",
      });
    }
  };

  const formatPreferencesForAIContext = (): string => {
    if (Object.keys(userPreferences).length === 0) return "";
    let context = "Contexto del usuario: ";
    const preferencesList: string[] = [];
    if (userPreferences.objective) preferencesList.push(`Objetivo principal - ${userPreferences.objective}`);
    if (userPreferences.experience) preferencesList.push(`Experiencia/Nivel de fitness - ${userPreferences.experience}`);
    if (userPreferences.recipePreference) preferencesList.push(`Preferencia de recetas - ${userPreferences.recipePreference}`);
    if (userPreferences.wearable) preferencesList.push(`Usa wearable - ${userPreferences.wearable}`);
    if (userPreferences.timeAvailablePerSession) preferencesList.push(`Tiempo por sesión - ${userPreferences.timeAvailablePerSession}`);
    if (userPreferences.daysPerWeek) preferencesList.push(`Días por semana - ${userPreferences.daysPerWeek}`);
    if (userPreferences.preferredStyle) preferencesList.push(`Estilo preferido - ${userPreferences.preferredStyle}`);
    if (userPreferences.averageSleepHours) preferencesList.push(`Horas de sueño promedio - ${userPreferences.averageSleepHours}`);
    if (userPreferences.restingHeartRate) preferencesList.push(`Frecuencia cardíaca en reposo - ${userPreferences.restingHeartRate}`);
    if (userPreferences.recentActivitySummary) preferencesList.push(`Resumen de actividad reciente - ${userPreferences.recentActivitySummary}`);
    if (userPreferences.stressLevel) preferencesList.push(`Nivel de estrés - ${userPreferences.stressLevel}`);

    context += preferencesList.join(". ") + ".";
    return context;
  };

  const speakText = (text: string) => {
    if (!browserSupportsSpeech || !utteranceRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    utteranceRef.current.text = text;
    window.speechSynthesis.speak(utteranceRef.current);
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

    if (isQuestionnaireComplete && Object.keys(userPreferences).length > 0) {
        const preferencesContext = formatPreferencesForAIContext();
        // Solo añadir contexto si no se está enviando una respuesta a una pregunta específica de la IA
        // y si el input actual no empieza ya con el contexto.
        if (!currentInputForAPI.toLowerCase().includes("contexto del usuario:")) {
             currentInputForAPI = `${preferencesContext} Mi pregunta es: ${currentInputForAPI}`;
        }
    }
    
    try {
      const result = await handleRecipeChat({ userQuery: currentInputForAPI, chatHistory: chatHistoryForAPI });
      if (result.success && result.data) {
        const newAssistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.data.aiResponse,
        };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
        speakText(result.data.aiResponse);

        const aiResponseLower = result.data.aiResponse.toLowerCase();
        if (aiResponseLower.includes(WORKOUT_GENERATION_PROMPT_KEYPHRASE_ES) || aiResponseLower.includes(WORKOUT_GENERATION_PROMPT_KEYPHRASE_EN)) {
          setShowGenerateWorkoutButton(true);
        }

      } else {
        const errorText = result.error || 'No se pudo obtener una respuesta.';
        toast({ title: 'Error del Asistente', description: errorText, variant: 'destructive' });
        const errorAssistantMessage: ChatMessage = { id: `assistant-error-${Date.now()}`, role: 'assistant', content: errorText };
        setMessages((prevMessages) => [...prevMessages, errorAssistantMessage]);
        speakText(errorText);
      }
    } catch (error) {
      const errorText = 'No se pudo conectar con el asistente de IA.';
      toast({ title: 'Error de Conexión', description: errorText, variant: 'destructive' });
      const errorAssistantMessage: ChatMessage = { id: `assistant-error-${Date.now()}`, role: 'assistant', content: errorText };
      setMessages((prevMessages) => [...prevMessages, errorAssistantMessage]);
      speakText(errorText);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  const handleSuggestedPrompt = (promptText: string) => {
    setInput(promptText); // No es necesario setInput si vamos a enviar directamente
    handleSubmit(undefined, promptText);
  };
  
  const handleToggleListen = () => {
    if (!browserSupportsSpeech || !speechRecognitionRef.current) return;
    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
        toast({ title: "Escuchando...", description: "Habla ahora."});
      } catch (error) {
        console.error("Error al iniciar reconocimiento:", error);
        setIsListening(false);
        toast({ title: "Error de Micrófono", description: "No se pudo iniciar el reconocimiento de voz.", variant: "destructive" });
      }
    }
  };

  const handleGenerateWorkout = async () => {
    setShowGenerateWorkoutButton(false);
    setIsLoading(true);
    const userMessageContent = "¡Sí, por favor genera la rutina!";
    const userMessage: ChatMessage = { id: `user-confirm-workout-${Date.now()}`, role: 'user', content: userMessageContent };
    setMessages(prev => [...prev, userMessage]);

    console.log("Preparando para generar rutina con preferencias:", userPreferences);
    
    // TODO: Construir workoutInput con todos los datos (de userPreferences y si es necesario, pedir más)
    // const workoutInput: PersonalizedWorkoutInput = { 
    //   fitnessLevel: userPreferences.experience as any, // Asegúrate de mapear correctamente
    //   goals: userPreferences.objective ? [userPreferences.objective] : [], // Adaptar
    //   timeAvailablePerSession: userPreferences.timeAvailablePerSession || "No especificado",
    //   daysPerWeek: userPreferences.daysPerWeek || 3, // Valor por defecto o pedir
    //   limitations: userPreferences.limitations,
    //   preferredStyle: userPreferences.preferredStyle as any,
    //   availableEquipment: userPreferences.availableEquipment,
    //   averageSleepHours: userPreferences.averageSleepHours,
    //   restingHeartRate: userPreferences.restingHeartRate,
    //   recentActivitySummary: userPreferences.recentActivitySummary,
    //   stressLevel: userPreferences.stressLevel
    // };
    // const result = await handleGenerateWorkoutAction(workoutInput); 
    // Y luego mostrar el resultado

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
    const assistantMessageContent = "¡Rutina en camino! 🏋️‍♀️ (Esto es un marcador de posición. La integración completa es el siguiente paso, ¡y va a ser épica!). ¿Algo más en lo que pueda ayudarte mientras tanto?";
    const assistantMessage: ChatMessage = { id: `assistant-workout-placeholder-${Date.now()}`, role: 'assistant', content: assistantMessageContent };
    setMessages(prev => [...prev, assistantMessage]);
    speakText(assistantMessageContent);
    setIsLoading(false);
    toast({ title: "Generación de Rutina Iniciada (Simulación)", description: "La rutina completa se mostrará aquí cuando esté integrada." });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0 flex flex-col h-[calc(100vh-8rem)] max-h-[800px] items-center">
      {!browserSupportsSpeech && (
         <Alert variant="destructive" className="mb-4 max-w-2xl w-full">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Funcionalidad de Voz no Soportada</AlertTitle>
            <AlertDescriptionComponent>
              Tu navegador actual no es compatible con las funciones de reconocimiento o síntesis de voz. Algunas características del chat pueden no estar disponibles.
            </AlertDescriptionComponent>
        </Alert>
      )}
      <Card className="w-full max-w-2xl shadow-xl flex flex-col flex-1 rounded-lg">
        <CardHeader className="text-center border-b pb-4">
          <div className="inline-block p-2.5 bg-primary/10 rounded-full mx-auto mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Chat con NutriChef AI
          </CardTitle>
          <p className="text-muted-foreground text-sm">Tu coach de fitness y nutrición. ¡Pregúntame lo que sea!</p>
        </CardHeader>

        {(!isQuestionnaireActive && !isQuestionnaireComplete && messages.length === 1 && messages[0].id === 'init-bot-welcome') && (
            <CardContent className="p-6 flex flex-col items-center justify-center">
                <Button onClick={handleStartQuestionnaire} className="bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3 px-6">
                    <Rocket className="mr-2 h-5 w-5" /> ¡Empecemos!
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Responde unas preguntas para personalizar tu experiencia.</p>
            </CardContent>
        )}

        {isQuestionnaireActive && currentQuestionIndex < questionnaireQuestions.length && (
          <CardContent className="p-6 space-y-4">
            <p className="text-lg font-semibold text-center text-primary mb-4">
              {questionnaireQuestions[currentQuestionIndex].text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questionnaireQuestions[currentQuestionIndex].options.map((opt) => (
                <Button
                  key={opt.value}
                  variant="outline"
                  className="h-auto py-3 justify-center text-center text-sm hover:bg-primary/10 hover:border-primary"
                  onClick={() => handleQuestionnaireResponse(questionnaireQuestions[currentQuestionIndex].key, opt.value, opt.label)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
             <p className="text-xs text-muted-foreground text-center mt-3">
                Pregunta {currentQuestionIndex + 1} de {questionnaireQuestions.length}
            </p>
          </CardContent>
        )}

        <CardContent className={cn("p-0 flex-1 overflow-hidden", (isQuestionnaireActive || (!isQuestionnaireComplete && messages.length === 1 && !isQuestionnaireActive)) && "hidden")}>
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div ref={viewportRef} className="h-full p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 self-start shrink-0">
                       <AvatarFallback className="bg-primary rounded-full p-1.5">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                       </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-xl p-3 shadow-sm",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-8 w-8 self-start shrink-0">
                        <AvatarFallback className="bg-accent rounded-full p-1.5">
                          <User className="h-5 w-5 text-accent-foreground" />
                        </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8 self-start shrink-0">
                    <AvatarFallback className="bg-primary rounded-full p-1.5">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[75%] rounded-xl p-3 shadow-sm bg-muted text-foreground rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className={cn("border-t p-4 bg-background flex flex-col gap-3", (isQuestionnaireActive || (!isQuestionnaireComplete && messages.length === 1 && !isQuestionnaireActive)) && "hidden")}>
          {showGenerateWorkoutButton && (
            <Button onClick={handleGenerateWorkout} className="w-full mb-3 bg-green-600 hover:bg-green-700 text-white">
              <Activity className="mr-2 h-5 w-5" /> Sí, generar mi rutina
            </Button>
          )}
          {isQuestionnaireComplete && (
            <div className="w-full">
                <p className="text-xs text-muted-foreground mb-2 text-center">¿No sabes qué preguntar? Prueba una de estas sugerencias:</p>
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {suggestedPrompts.map(promptText => (
                        <Button 
                          key={promptText} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSuggestedPrompt(promptText)} 
                          className="text-xs h-auto py-1.5 px-3 rounded-full border-primary/50 text-primary hover:bg-primary/10"
                        >
                            {promptText}
                        </Button>
                    ))}
                </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Escribe tu pregunta o usa el micrófono..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isQuestionnaireActive || isListening}
              className="flex-1"
              autoComplete="off"
            />
            {browserSupportsSpeech && (
              <Button 
                type="button" 
                onClick={handleToggleListen} 
                disabled={isLoading || isQuestionnaireActive} 
                size="icon" 
                variant={isListening ? "destructive" : "outline"}
                className={cn("shrink-0", isListening && "bg-destructive/20 border-destructive text-destructive animate-pulse")}
                title={isListening ? "Detener grabación" : "Grabar voz"}
              >
                <Mic className="h-5 w-5" />
                <span className="sr-only">{isListening ? "Detener grabación" : "Grabar voz"}</span>
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !input.trim() || isQuestionnaireActive || isListening} size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}


    