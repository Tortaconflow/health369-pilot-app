
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // AvatarImage no es necesario si usamos iconos
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { handleRecipeChat } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Mensaje inicial del bot
    setMessages([
      { id: 'init-bot', role: 'assistant', content: '¡Hola! Soy NutriChef AI. ¿En qué receta o idea de comida saludable puedo ayudarte hoy?' }
    ]);
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Para el historial, no incluimos el mensaje inicial si es el único mensaje del asistente
    const chatHistoryForAPI = messages
        .filter(msg => !(msg.id === 'init-bot' && messages.filter(m => m.role === 'assistant').length === 1))
        .map(msg => ({ role: msg.role, content: msg.content }));

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
      // Ensure scroll to bottom after response and loading state update
      setTimeout(scrollToBottom, 0);
    }
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
        <CardContent className="p-0 flex-1 overflow-hidden">
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
        <CardFooter className="border-t p-4 bg-background">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Escribe tu pregunta sobre recetas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

    