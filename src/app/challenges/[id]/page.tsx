import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Challenge, ChallengeParticipant } from "@/types/domain";
import { Award, CalendarDays, Users, Target, Zap, Clock, Edit, Upload, ShieldCheck, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProgressRegistrationForm from "@/components/challenges/ProgressRegistrationForm";
import ChallengeParticipants from "@/components/challenges/ChallengeParticipants";
import ChallengeResults from "@/components/challenges/ChallengeResults";

// Mock data - replace with actual data fetching for a single challenge by ID
const mockChallenge: Challenge = {
  id: "challenge1",
  name: "Transformación Verano 30 Días", // Translated
  description: "Prepárate para el verano con este intenso desafío de transformación de 30 días. Enfócate en la pérdida de grasa y definición muscular. Los participantes registrarán peso, medidas de cintura y enviarán fotos de antes/después. La IA evaluará la mejor transformación basada en datos y progreso visual.", // Translated
  duration: "30 días",
  objective: "Perder 3-5kg y mejorar definición", // Translated
  entryFee: 100,
  creatorId: "user123",
  participants: [
    { id: "p1", userId: "u1", name: "Alicia Pérez", avatarUrl: "https://placehold.co/50x50.png?text=AP" }, // Translated
    { id: "p2", userId: "u2", name: "Roberto Gómez", avatarUrl: "https://placehold.co/50x50.png?text=RG" }, // Translated
    { id: "p3", userId: "uCurrent", name: "Usuario Actual", avatarUrl: "https://placehold.co/50x50.png?text=UA" }, // Translated
  ],
  status: "active",
  startDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
  endDate: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 days from now
  coverImageUrl: "https://placehold.co/1200x400.png?text=Desafio+Verano+Intenso", // Translated placeholder text
  prizePool: 300, // 100 entry * 3 participants
};

// Mock current user ID
const currentUserId = "uCurrent";

export default function ChallengeDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, fetch challenge data based on params.id
  const challenge = mockChallenge;

  if (!challenge) {
    return <div className="container mx-auto py-8 text-center">Desafío no encontrado.</div>;
  }

  const isParticipant = challenge.participants.some(p => p.userId === currentUserId);
  const daysTotal = Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 3600 * 24));
  const daysPassed = Math.max(0, Math.ceil((Date.now() - new Date(challenge.startDate).getTime()) / (1000 * 3600 * 24)));
  const progressPercentage = Math.min(100, (daysPassed / daysTotal) * 100);
  const challengeStatusText = challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1);
  const statusTextMap: Record<Challenge['status'], string> = {
    active: "Activo",
    upcoming: "Próximo",
    completed: "Completado"
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="w-full shadow-xl overflow-hidden">
        <CardHeader className="p-0 relative">
          <Image
            src={challenge.coverImageUrl || "https://placehold.co/1200x400.png"}
            alt={challenge.name}
            width={1200}
            height={400}
            className="w-full h-60 md:h-80 object-cover"
            data-ai-hint="challenge banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{challenge.name}</h1>
            <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'} className={challenge.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
              {statusTextMap[challenge.status] || challengeStatusText}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-primary mb-2">Resumen del Desafío</h2>
                <p className="text-foreground/80 leading-relaxed">{challenge.description}</p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <InfoPill icon={<Target className="text-accent" />} label="Objetivo" value={challenge.objective} />
                <InfoPill icon={<Clock className="text-accent" />} label="Duración" value={challenge.duration} />
                <InfoPill icon={<CalendarDays className="text-accent" />} label="Inicia" value={new Date(challenge.startDate).toLocaleDateString()} />
                <InfoPill icon={<CalendarDays className="text-accent" />} label="Finaliza" value={new Date(challenge.endDate).toLocaleDateString()} />
                <InfoPill icon={<Users className="text-accent" />} label="Participantes" value={`${challenge.participants.length}`} />
                {challenge.entryFee && (
                  <InfoPill icon={<Zap className="text-accent" />} label="Cuota de Entrada" value={`🪙 ${challenge.entryFee} monedas`} />
                )}
              </div>
              
              {challenge.status === 'active' && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-1">Progreso del Desafío</h3>
                  <Progress value={progressPercentage} className="w-full h-3" />
                  <p className="text-xs text-muted-foreground text-right mt-1">{daysPassed} / {daysTotal} días</p>
                </div>
              )}
              
              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
                  <TabsTrigger value="progress">Registrar Progreso</TabsTrigger>
                  <TabsTrigger value="participants">Participantes</TabsTrigger>
                  <TabsTrigger value="results">Resultados</TabsTrigger>
                </TabsList>
                <TabsContent value="progress">
                  {isParticipant && challenge.status === 'active' ? (
                    <ProgressRegistrationForm challengeId={challenge.id} />
                  ) : challenge.status !== 'active' ? (
                    <p className="text-muted-foreground text-center py-4">Este desafío no está activo actualmente para registrar progreso.</p>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Únete al desafío para registrar tu progreso.</p>
                  )}
                </TabsContent>
                <TabsContent value="participants">
                  <ChallengeParticipants participants={challenge.participants} />
                </TabsContent>
                <TabsContent value="results">
                  <ChallengeResults challenge={challenge} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Bote de Premios</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-accent">🪙 {challenge.prizePool || (challenge.entryFee || 0) * challenge.participants.length}</p>
                  <p className="text-sm text-muted-foreground">El ganador se lleva todo (o se distribuye según las reglas)</p>
                </CardContent>
              </Card>

              {!isParticipant && challenge.status === 'upcoming' && (
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Unirse al Desafío {challenge.entryFee ? `(🪙 ${challenge.entryFee})` : '(Gratis)'}
                </Button>
              )}
              {challenge.status === 'completed' && challenge.winnerId && (
                <Card className="bg-yellow-50 border-yellow-300">
                    <CardHeader className="items-center text-center">
                        <Trophy className="h-12 w-12 text-yellow-500 mb-2"/>
                        <CardTitle className="text-2xl text-yellow-700">¡Ganador del Desafío!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg font-semibold text-yellow-600">
                            {challenge.participants.find(p => p.userId === challenge.winnerId)?.name || 'Nombre del Ganador'}
                        </p>
                        <p className="text-sm text-muted-foreground">¡Felicidades por una transformación increíble!</p>
                    </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center bg-muted/30 p-3 rounded-lg">
      <span className="flex-shrink-0 w-5 h-5 mr-2">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground/90">{value}</p>
      </div>
    </div>
  );
}
