
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; // Importado Progress
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile as UserProfileType } from "@/types/domain";
import { Award, BarChart3, Edit3, Shield, Star, User, Zap, Palette, Camera } from "lucide-react";
import Image from "next/image";
import ThemeSelector from "@/components/layout/ThemeSelector";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - replace with actual data fetching
const mockUserProfile: UserProfileType = {
  id: "user123",
  name: "Alex García",
  email: "alex.g@example.com",
  avatarUrl: "https://placehold.co/200x200.png",
  level: 5,
  experiencePoints: 450, // XP acumulado DENTRO del nivel actual
  badges: ["Madrugador", "Iniciador de Desafíos", "Maestro de Rachas"],
  virtualCurrency: 1500,
  healthGoals: ["Perder 5kg para julio", "Correr 5k tres veces por semana", "Comer más verduras"],
  preferences: {
    notifications: "enabled",
    theme: "light",
  },
  progress: {
    weight: 75,
    waist: 80,
    muscleMassPercentage: 20,
    lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
);

// Lazy-loaded Tab Contents
const ProgressTab = dynamic(() => import('@/components/profile/ProgressTab'), {
  loading: () => <LoadingSkeleton />,
});
const BadgesTab = dynamic(() => import('@/components/profile/BadgesTab'), {
  loading: () => <LoadingSkeleton />,
});
const SettingsTab = dynamic(() => import('@/components/profile/SettingsTab'), {
  loading: () => <LoadingSkeleton />,
});


export default function ProfilePage() {
  // Lógica para la barra de progreso de XP
  const xpForNextLevel = (currentLevel: number) => {
    // Fórmula de ejemplo: cada nivel requiere más XP que el anterior
    // Nivel 1 -> Nivel 2 necesita (1*100 + 50) = 150 XP
    // Nivel 5 -> Nivel 6 necesita (5*100 + 50) = 550 XP
    return (currentLevel * 100) + 50;
  };

  const totalXpNeededForThisLevel = xpForNextLevel(mockUserProfile.level);
  const xpProgressPercentage = Math.min(100, (mockUserProfile.experiencePoints / totalXpNeededForThisLevel) * 100);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
              <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{mockUserProfile.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-primary">{mockUserProfile.name}</h1>
              <p className="text-lg text-muted-foreground">{mockUserProfile.email}</p>
              <div className="mt-2 flex items-center gap-4 flex-wrap">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 mr-1 fill-current" /> Nivel {mockUserProfile.level}
                </div>
                <div className="flex items-center text-accent">
                  <Zap className="h-5 w-5 mr-1" /> {mockUserProfile.experiencePoints} XP
                </div>
                <div className="flex items-center text-primary"> {/* Ajustado para usar color primario (Verde Esmeralda) */}
                  🪙 {mockUserProfile.virtualCurrency} Monedas
                </div>
              </div>
              <div className="mt-3">
                <Progress value={xpProgressPercentage} className="w-full h-2.5" />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  Progreso al Nivel {mockUserProfile.level + 1}: {mockUserProfile.experiencePoints} / {totalXpNeededForThisLevel} XP
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="md:ml-auto mt-4 md:mt-0 self-start md:self-center">
                <Edit3 className="mr-2 h-4 w-4"/> Editar Perfil
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="progress">Progreso</TabsTrigger>
              <TabsTrigger value="badges">Insignias</TabsTrigger>
              <TabsTrigger value="settings">Ajustes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Section title="Metas de Salud">
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {mockUserProfile.healthGoals?.map(goal => <li key={goal}>{goal}</li>)}
                </ul>
              </Section>
              <Separator className="my-6" />
              <Section title="Actividad Reciente">
                <p className="text-muted-foreground">Se unió al "Desafío de Verano".</p>
                <p className="text-muted-foreground">Completó "Carrera Matutina" 3 veces esta semana.</p>
              </Section>
            </TabsContent>

            <TabsContent value="progress">
              <ProgressTab userProfile={mockUserProfile}/>
            </TabsContent>
            
            <TabsContent value="badges">
              <BadgesTab userProfile={mockUserProfile}/>
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab userProfile={mockUserProfile}/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

function Section({ title, children, className }: SectionProps) {
  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      {children}
    </div>
  );
}
