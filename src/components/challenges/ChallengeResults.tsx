"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Challenge, ChallengeParticipant } from "@/types/domain";
import { Award, Brain, Loader2, CheckCircle, AlertTriangle, Trophy } from "lucide-react";
import { evaluateChallengeCompletion } from "@/app/actions/challengeActions"; // Server action
import type { EvaluateChallengeOutput } from "@/ai/flows/challenge-evaluation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ChallengeResultsProps {
  challenge: Challenge;
}

// Mock participant data with 'before' and 'after' photos
const mockNumericalData = [
    { participantId: "p1", weight: 70, waist: 80, muscleMassPercentage: 20 }, // Alice before
    { participantId: "p1", weight: 65, waist: 75, muscleMassPercentage: 22 }, // Alice after
    { participantId: "p2", weight: 85, waist: 90, muscleMassPercentage: 18 }, // Bob before
    { participantId: "p2", weight: 80, waist: 82, muscleMassPercentage: 20 }, // Bob after
];
const mockBeforePhotos = [
    { participantId: "p1", photoDataUri: "https://placehold.co/300x400.png?text=Alicia+Antes" },
    { participantId: "p2", photoDataUri: "https://placehold.co/300x400.png?text=Roberto+Antes" },
];
const mockAfterPhotos = [
    { participantId: "p1", photoDataUri: "https://placehold.co/300x400.png?text=Alicia+Despues" },
    { participantId: "p2", photoDataUri: "https://placehold.co/300x400.png?text=Roberto+Despues" },
];


export default function ChallengeResults({ challenge }: ChallengeResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluateChallengeOutput | null>(null);
  const { toast } = useToast();

  const handleEvaluateChallenge = async () => {
    setIsLoading(true);
    setEvaluationResult(null);
    try {
      // Prepare data for AI. In a real app, this data would be fetched from a DB.
      const input = {
        numericalData: mockNumericalData, // Use structured mock data
        beforePhotos: mockBeforePhotos,   // Use structured mock data
        afterPhotos: mockAfterPhotos,     // Use structured mock data
      };
      
      const result = await evaluateChallengeCompletion(input);
      if (result.success && result.data) {
        setEvaluationResult(result.data);
        const winnerName = challenge.participants.find(p=>p.id === result.data?.winnerId)?.name || result.data?.winnerId;
        toast({ title: "¡Evaluación Completa!", description: `Ganador: ${winnerName}. Resumen disponible.`, className: "bg-green-500 text-white" });
      } else {
        toast({ title: "Evaluación Fallida", description: result.error || "No se pudo evaluar el desafío.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Challenge evaluation error:", error);
      toast({ title: "Error", description: "Ocurrió un error inesperado durante la evaluación.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const winner = challenge.participants.find(p => p.userId === (evaluationResult?.winnerId || challenge.winnerId));

  if (challenge.status !== 'completed' && !evaluationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" /> Resultados del Desafío
          </CardTitle>
          <CardDescription>Los resultados estarán disponibles una vez que el desafío se complete y evalúe.</CardDescription>
        </CardHeader>
        {challenge.status === 'active' && ( // Or based on admin role
             <CardContent>
                 <Button onClick={handleEvaluateChallenge} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                    Activar Evaluación IA (Admin)
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">Esto simula el proceso de evaluación de IA. La evaluación real utiliza datos de los participantes.</p>
             </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <Trophy className="mr-3 h-7 w-7 text-yellow-500" /> Resultados del Desafío y Evaluación IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">IA está evaluando los resultados...</p>
          </div>
        )}

        {evaluationResult && winner && (
          <Alert className="bg-green-50 border-green-300">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-700 text-xl font-semibold">¡Ganador Declarado!</AlertTitle>
            <AlertDescription className="text-green-600 mt-2">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={winner.avatarUrl} alt={winner.name} data-ai-hint="winner avatar"/>
                  <AvatarFallback>{winner.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-2xl font-bold">{winner.name}</p>
                    <p className="text-sm">¡ha mostrado el mejor cambio físico!</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {evaluationResult && (
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><Brain className="mr-2 h-5 w-5 text-primary"/> Resumen de Evaluación IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/90 whitespace-pre-line">
                        {evaluationResult.evaluationSummary || "La evaluación de IA determinó al ganador basándose en el progreso general de los datos numéricos y la transformación visual en las fotos."}
                    </p>
                </CardContent>
            </Card>
        )}

        {!isLoading && !evaluationResult && challenge.status === 'completed' && (
             <Alert variant="default">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Evaluación Pendiente</AlertTitle>
                <AlertDescription>
                El desafío está completo, pero la evaluación de IA no se ha ejecutado o los resultados aún no están disponibles.
                 <Button onClick={handleEvaluateChallenge} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                    Ejecutar Evaluación IA Ahora
                </Button>
                </AlertDescription>
          </Alert>
        )}
        
        {/* Display example of before/after for winner - in real app this would be dynamic */}
        {winner && evaluationResult && (
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2 text-center">Transformación del Ganador (Ejemplo)</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-center text-muted-foreground mb-1">Antes</p>
                        <Image src={mockBeforePhotos.find(p=>p.participantId === winner.id)?.photoDataUri || "https://placehold.co/300x400.png?text=Antes"} alt="Ganador Antes" width={300} height={400} className="rounded-lg shadow-md mx-auto" data-ai-hint="progress photo" />
                    </div>
                     <div>
                        <p className="text-sm text-center text-muted-foreground mb-1">Después</p>
                        <Image src={mockAfterPhotos.find(p=>p.participantId === winner.id)?.photoDataUri || "https://placehold.co/300x400.png?text=Despues"} alt="Ganador Después" width={300} height={400} className="rounded-lg shadow-md mx-auto" data-ai-hint="progress photo" />
                    </div>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
