import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile as UserProfileType } from "@/types/domain";
import { Award, BarChart3, Edit3, Shield, Star, User, Zap } from "lucide-react";
import Image from "next/image";

// Mock data - replace with actual data fetching
const mockUserProfile: UserProfileType = {
  id: "user123",
  name: "Alex García", // Translated
  email: "alex.g@example.com",
  avatarUrl: "https://placehold.co/200x200.png",
  level: 5,
  experiencePoints: 450,
  badges: ["Madrugador", "Iniciador de Desafíos", "Maestro de Rachas"], // Translated
  virtualCurrency: 1500,
  healthGoals: ["Perder 5kg para julio", "Correr 5k tres veces por semana", "Comer más verduras"], // Translated
  preferences: {
    notifications: "enabled", // Consider translating "enabled" if shown in UI
    theme: "light", // "claro" / "oscuro"
  },
  progress: {
    weight: 75,
    waist: 80,
    muscleMassPercentage: 20,
    lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  }
};


export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-md">
              <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{mockUserProfile.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-primary">{mockUserProfile.name}</h1>
              <p className="text-lg text-muted-foreground">{mockUserProfile.email}</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 mr-1" /> Nivel {mockUserProfile.level}
                </div>
                <div className="flex items-center text-accent">
                  <Zap className="h-5 w-5 mr-1" /> {mockUserProfile.experiencePoints} XP
                </div>
                <div className="flex items-center text-green-500">
                  🪙 {mockUserProfile.virtualCurrency} Monedas
                </div>
              </div>
            </div>
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
              <Section title="Estadísticas Actuales">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <StatDisplay label="Peso" value={`${mockUserProfile.progress?.weight || 'N/A'} kg`} />
                    <StatDisplay label="Cintura" value={`${mockUserProfile.progress?.waist || 'N/A'} cm`} />
                    <StatDisplay label="Masa Muscular" value={`${mockUserProfile.progress?.muscleMassPercentage || 'N/A'} %`} />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    Última actualización: {new Date(mockUserProfile.progress?.lastUpdated || Date.now()).toLocaleDateString()}
                </p>
              </Section>
              <Separator className="my-6" />
              <Section title="Fotos de Progreso">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Antes</h4>
                        <Image src="https://placehold.co/300x400.png?text=Antes" alt="Foto Antes" width={300} height={400} className="rounded-lg shadow-md" data-ai-hint="progress photo" />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Después (Ejemplo)</h4>
                        <Image src="https://placehold.co/300x400.png?text=Despues" alt="Foto Después Ejemplo" width={300} height={400} className="rounded-lg shadow-md" data-ai-hint="progress photo" />
                    </div>
                 </div>
              </Section>
            </TabsContent>
            
            <TabsContent value="badges">
              <Section title="Insignias Ganadas">
                <div className="flex flex-wrap gap-3">
                  {mockUserProfile.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="px-3 py-1 text-sm bg-accent/20 text-accent-foreground border-accent">
                      <Award className="h-4 w-4 mr-1.5" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </Section>
            </TabsContent>

            <TabsContent value="settings">
              <Section title="Información de la Cuenta">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" defaultValue={mockUserProfile.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" defaultValue={mockUserProfile.email} disabled />
                  </div>
                  <Button><Edit3 className="h-4 w-4 mr-2" />Guardar Cambios</Button>
                </div>
              </Section>
              <Separator className="my-6" />
              <Section title="Seguridad">
                 <Button variant="outline"><Shield className="h-4 w-4 mr-2" />Cambiar Contraseña</Button>
              </Section>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-primary">{title}</h3>
      {children}
    </div>
  );
}

function StatDisplay({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-background p-4 rounded-lg shadow">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-accent">{value}</p>
        </div>
    );
}
