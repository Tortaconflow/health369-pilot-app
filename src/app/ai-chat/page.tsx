
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot, Loader2, Rocket, Brain, Edit3, Activity } from 'lucide-react';
import { handleRecipeChat } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
// Asegúrate de importar el tipo PersonalizedWorkoutInput si lo vas a usar para tipar el estado
// import type { PersonalizedWorkoutInput } from '@/ai/flows/personalized-workout-flow';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface QuestionnaireQuestion {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  key: keyof UserPreferences; // Ajustado para UserPreferences
}

// Estas son las preferencias que recopilamos del cuestionario inicial
interface UserPreferences {
  objective?: string;       // Mapea a 'goals' para PersonalizedWorkoutInput
  experience?: string;      // Mapea a 'fitnessLevel' para PersonalizedWorkoutInput
  recipePreference?: string;
  wearable?: string;
  // Estos campos se necesitarían para PersonalizedWorkoutInput, pero no están en el cuestionario actual
  timeAvailablePerSession?: string;
  daysPerWeek?: number;
  limitations?: string[];
  preferredStyle?: string;
  availableEquipment?: string[];
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
      { value: 'avanzado', label: 'Sí, soy experto/a' }, // Ajustado a valores de fitnessLevel
      { value: 'intermedio', label: 'Algo de experiencia' }, // Ajustado
      { value: 'principiante', label: 'Ninguna' }, // Ajustado
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

// Frase clave para detectar si la IA está lista para generar una rutina
const WORKOUT_GENERATION_PROMPT_KEYPHRASE = "¿quieres que procedamos a generar una propuesta de entrenamiento personalizada para ti?";


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


  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isQuestionnaireComplete && messages.length === 0) {
         setMessages([
            { id: 'init-bot-welcome', role: 'assistant', content: '¡Hola! Soy NutriChef AI. Para ayudarte mejor, ¿te gustaría responder unas breves preguntas?' }
         ]);
    } else if (isQuestionnaireComplete && messages.length === 0) {
         setMessages([
            { id: 'init-bot-ready', role: 'assistant', content: '¡Hola de nuevo! Gracias por tus respuestas. ¿En qué receta o idea de comida saludable puedo ayudarte hoy?' }
         ]);
    }
  }, [isQuestionnaireComplete, messages.length]);


  const handleStartQuestionnaire = () => {
    setIsQuestionnaireActive(true);
    setShowGenerateWorkoutButton(false); // Ocultar si estaba visible
    setMessages(prev => [...prev, {id: 'user-start-q', role: 'user', content: "Sí, quiero responder las preguntas."}]);
  };

  const handleQuestionnaireResponse = (questionKey: keyof UserPreferences, answerValue: string, answerLabel: string) => {
    setUserPreferences(prev => ({ ...prev, [questionKey]: answerLabel }));
    setMessages(prev => [...prev, {id: `user-q-ans-${questionKey}-${Date.now()}`, role: 'user', content: answerLabel}]);

    if (currentQuestionIndex < questionnaireQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuestionnaireActive(false);
      setIsQuestionnaireComplete(true);
      setMessages(prev => [...prev, {id: 'bot-q-complete', role: 'assistant', content: '¡Gracias por tus respuestas! Ahora puedo personalizar mejor mis sugerencias. ¿En qué te puedo ayudar hoy?'}]);
      toast({
        title: "Cuestionario Completo",
        description: "Tus preferencias han sido guardadas para esta sesión.",
        className: "bg-green-500 text-white",
      });
    }
  };

  const formatPreferencesForAIContext = (): string => {
    if (Object.keys(userPreferences).length === 0) return "";
    let context = "Contexto del usuario: ";
    const preferencesList: string[] = [];
    if (userPreferences.objective) preferencesList.push(`Objetivo principal - ${userPreferences.objective}`);
    if (userPreferences.experience) preferencesList.push(`Experiencia/Nivel de fitness - ${userPreferences.experience}`); // Mapea a fitnessLevel
    if (userPreferences.recipePreference) preferencesList.push(`Preferencia de recetas - ${userPreferences.recipePreference}`);
    if (userPreferences.wearable) preferencesList.push(`Usa wearable - ${userPreferences.wearable}`);
    // Faltan timeAvailablePerSession, daysPerWeek, etc. La IA los pedirá si es necesario.
    context += preferencesList.join(". ") + ".";
    return context;
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, promptedQuery?: string) => {
    if (e) e.preventDefault();
    setShowGenerateWorkoutButton(false); // Ocultar botón de generar rutina al enviar nuevo mensaje

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
        .concat(messages.filter(msg => msg.id.startsWith('user-q-ans-') || msg.id === 'user-start-q'))
        .map(msg => ({ role: msg.role, content: msg.content }));

    if (isQuestionnaireComplete && Object.keys(userPreferences).length > 0) {
        const preferencesContext = formatPreferencesForAIContext();
        // Solo añadir el contexto si este es el primer mensaje "real" después del cuestionario o si no se ha añadido antes.
        // Una forma simple es verificar si la query actual ya tiene el prefijo.
        if (!currentInputForAPI.startsWith("Contexto del usuario:")) {
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

        // Comprobar si la IA está lista para generar la rutina
        if (result.data.aiResponse.toLowerCase().includes(WORKOUT_GENERATION_PROMPT_KEYPHRASE.toLowerCase())) {
          setShowGenerateWorkoutButton(true);
        }

      } else {
        toast({
          title: 'Error del Asistente',
          description: result.error || 'No se pudo obtener una respuesta.',
          variant: 'destructive',
        });
         const errorAssistantMessage: ChatMessage = {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: result.error || "Lo siento, no pude procesar tu solicitud en este momento.",
        };
        setMessages((prevMessages) => [...prevMessages, errorAssistantMessage]);
      }
    } catch (error) {
      toast({
        title: 'Error de Conexión',
        description: 'No se pudo conectar con el asistente de IA.',
        variant: 'destructive',
      });
      const errorAssistantMessage: ChatMessage = {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: "Hubo un problema de conexión. Por favor, intenta de nuevo.",
        };
      setMessages((prevMessages) => [...prevMessages, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    handleSubmit(undefined, prompt);
  };

  const handleGenerateWorkout = async () => {
    setShowGenerateWorkoutButton(false); // Ocultar después de hacer clic
    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: `user-confirm-workout-${Date.now()}`,
      role: 'user',
      content: "Sí, por favor genera la rutina."
    };
    setMessages(prev => [...prev, userMessage]);

    // Simular que se está llamando a la acción de generar rutina
    // Aquí es donde construirías el PersonalizedWorkoutInput y llamarías a la acción del servidor
    console.log("Preparando para generar rutina con preferencias:", userPreferences);
    // TODO: Mapear userPreferences a PersonalizedWorkoutInput.
    // Por ejemplo:
    // const workoutInput: PersonalizedWorkoutInput = {
    //   fitnessLevel: userPreferences.experience || 'principiante', // Asignar un default o validar
    //   goals: userPreferences.objective ? [userPreferences.objective] : ['mejorar_salud_general'], // Asignar default o validar
    //   // ... obtener timeAvailablePerSession y daysPerWeek (actualmente no en userPreferences)
    //   // Por ahora, la IA debería haberlos pedido si eran necesarios.
    //   // Si no, necesitaremos una forma de preguntarlos aquí o modificar el cuestionario.
    //   timeAvailablePerSession: userPreferences.timeAvailablePerSession || "45 minutos", // Ejemplo, necesitaría ser recopilado
    //   daysPerWeek: userPreferences.daysPerWeek || 3, // Ejemplo, necesitaría ser recopilado
    //   limitations: userPreferences.limitations || [],
    //   preferredStyle: userPreferences.preferredStyle as any || 'mixto', // 'as any' si el tipo no coincide exactamente
    //   availableEquipment: userPreferences.availableEquipment || ['peso corporal'],
    // };

    // Aquí llamarías a la acción de servidor:
    // const result = await handleGenerateWorkoutAction(workoutInput);
    // Y luego mostrarías la rutina.

    // Simulación por ahora:
    await new Promise(resolve => setTimeout(resolve, 1500));
    const assistantMessage: ChatMessage = {
      id: `assistant-workout-placeholder-${Date.now()}`,
      role: 'assistant',
      content: "¡Rutina en camino! (Este es un marcador de posición. La integración completa de la generación de rutinas es el siguiente paso)."
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
     toast({
        title: "Generación de Rutina Iniciada (Simulación)",
        description: "La rutina completa se mostrará aquí cuando esté integrada.",
      });
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-0 flex flex-col h-[calc(100vh-8rem)] max-h-[800px] items-center">
      <Card className="w-full max-w-2xl shadow-xl flex flex-col flex-1 rounded-lg">
        <CardHeader className="text-center border-b pb-4">
          <div className="inline-block p-2.5 bg-primary/10 rounded-full mx-auto mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Chat con NutriChef AI
          </CardTitle>
          <p className="text-muted-foreground text-sm">Tu asistente personal para recetas y consejos de cocina.</p>
        </CardHeader>

        {(!isQuestionnaireActive && !isQuestionnaireComplete && messages.length === 1 && messages[0].id === 'init-bot-welcome') && (
            <CardContent className="p-6 flex flex-col items-center justify-center">
                <Button onClick={handleStartQuestionnaire} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Rocket className="mr-2 h-5 w-5" /> Comenzar Cuestionario
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Ayúdame a entenderte mejor.</p>
            </CardContent>
        )}

        {isQuestionnaireActive && currentQuestionIndex < questionnaireQuestions.length && (
          <CardContent className="p-6 space-y-4">
            <p className="text-lg font-semibold text-center text-primary">
              {questionnaireQuestions[currentQuestionIndex].text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questionnaireQuestions[currentQuestionIndex].options.map((opt) => (
                <Button
                  key={opt.value}
                  variant="outline"
                  className="h-auto py-3 justify-center text-center"
                  onClick={() => handleQuestionnaireResponse(questionnaireQuestions[currentQuestionIndex].key, opt.value, opt.label)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
             <p className="text-xs text-muted-foreground text-center mt-2">
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
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {suggestedPrompts.slice(0,2).map(prompt => (
                        <Button key={prompt} variant="outline" size="sm" onClick={() => handleSuggestedPrompt(prompt)} className="text-xs h-auto py-1.5">
                            {prompt}
                        </Button>
                    ))}
                </div>
                 <div className="grid grid-cols-2 gap-2">
                    {suggestedPrompts.slice(2,4).map(prompt => (
                        <Button key={prompt} variant="outline" size="sm" onClick={() => handleSuggestedPrompt(prompt)} className="text-xs h-auto py-1.5">
                            {prompt}
                        </Button>
                    ))}
                </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Escribe tu pregunta sobre recetas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isQuestionnaireActive}
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading || !input.trim() || isQuestionnaireActive} size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
