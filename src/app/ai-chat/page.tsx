
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot, Loader2, Rocket, Brain, Edit3 } from 'lucide-react';
import { handleRecipeChat } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
      { value: 'experto', label: 'Sí, soy experto/a' },
      { value: 'algo_experiencia', label: 'Algo de experiencia' },
      { value: 'ninguna', label: 'Ninguna' },
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

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Mensaje inicial del bot si el cuestionario no está completo
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
    setMessages(prev => [...prev, {id: 'user-start-q', role: 'user', content: "Sí, quiero responder las preguntas."}]);
  };
  
  const handleQuestionnaireResponse = (questionKey: keyof UserPreferences, answerValue: string, answerLabel: string) => {
    setUserPreferences(prev => ({ ...prev, [questionKey]: answerLabel }));
    setMessages(prev => [...prev, {id: `user-q-${questionKey}`, role: 'user', content: `${questionnaireQuestions[currentQuestionIndex].text}\nMi respuesta: ${answerLabel}`}]);


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

  const formatPreferencesForAI = (): string => {
    if (Object.keys(userPreferences).length === 0) return "";
    let context = "Contexto del usuario: ";
    const preferencesList: string[] = [];
    if (userPreferences.objective) preferencesList.push(`Objetivo principal - ${userPreferences.objective}`);
    if (userPreferences.experience) preferencesList.push(`Experiencia - ${userPreferences.experience}`);
    if (userPreferences.recipePreference) preferencesList.push(`Preferencia de recetas - ${userPreferences.recipePreference}`);
    if (userPreferences.wearable) preferencesList.push(`Usa wearable - ${userPreferences.wearable}`);
    context += preferencesList.join(". ") + ".";
    return context;
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, promptedQuery?: string) => {
    if (e) e.preventDefault();
    
    const query = promptedQuery || input.trim();
    if (!query || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    let currentInput = query;
    if (!promptedQuery) setInput(''); // Clear input only if it's not from a suggested prompt
    setIsLoading(true);

    const chatHistoryForAPI = messages
        .filter(msg => !(msg.id === 'init-bot-welcome' || msg.id === 'init-bot-ready' || msg.id === 'bot-q-complete' || msg.id.startsWith('user-q-')))
        .map(msg => ({ role: msg.role, content: msg.content }));
    
    if (isQuestionnaireComplete && Object.keys(userPreferences).length > 0) {
        const preferencesContext = formatPreferencesForAI();
        // Add context at the beginning of history for the AI, or prepend to the query
        // For this example, we'll prepend to the current query if it's the first "real" query after questionnaire
        if (chatHistoryForAPI.filter(m => m.role === 'user').length <= 1) { // if this is the first or second user message (first being "start questionnaire")
            currentInput = `${preferencesContext} Mi pregunta es: ${currentInput}`;
        }
    }

    try {
      const result = await handleRecipeChat({ userQuery: currentInput, chatHistory: chatHistoryForAPI });
      if (result.success && result.data) {
        const newAssistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.data.aiResponse,
        };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
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
    setInput(prompt); // Set input field with the prompt
    handleSubmit(undefined, prompt); // Directly submit
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

        {!isQuestionnaireActive && !isQuestionnaireComplete && messages.length === 1 && messages[0].id === 'init-bot-welcome' && (
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

        <CardContent className={cn("p-0 flex-1 overflow-hidden", (isQuestionnaireActive || (!isQuestionnaireComplete && messages.length === 1)) && "hidden")}>
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
