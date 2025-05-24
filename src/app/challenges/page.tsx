import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Challenge } from "@/types/domain";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { PlusCircle, Search, Filter, Zap } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    name: "Transformación Verano 30 Días", // Translated
    description: "Prepárate para el verano con este intenso desafío de transformación de 30 días. Enfócate en la pérdida de grasa y definición muscular.", // Translated
    duration: "30 días",
    objective: "Perder 3-5kg y mejorar definición", // Translated
    entryFee: 100,
    creatorId: "user123",
    participants: [{ id: "p1", userId: "u1", name: "Alicia" }, { id: "p2", userId: "u2", name: "Roberto" }], // Translated
    status: "active",
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    endDate: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 days from now
    coverImageUrl: "https://placehold.co/600x300.png?text=Transformacion+Verano", // Translated
  },
  {
    id: "challenge2",
    name: "Maratón Ganancia Muscular", // Translated
    description: "Un programa de 12 semanas diseñado para maximizar la hipertrofia muscular y la fuerza.", // Translated
    duration: "12 semanas",
    objective: "Ganar 2kg de masa muscular", // Translated
    entryFee: 200,
    creatorId: "expert2",
    participants: [],
    status: "upcoming",
    startDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    endDate: new Date(Date.now() + 86400000 * (7 + 12 * 7)).toISOString(),
    coverImageUrl: "https://placehold.co/600x300.png?text=Ganancia+Muscular", // Translated
  },
  {
    id: "challenge3",
    name: "Desafío Reductor de Cintura", // Translated
    description: "Reduce tu cintura y mejora la fuerza del core en solo 4 semanas.", // Translated
    duration: "4 semanas",
    objective: "Reducir 5cm de cintura", // Translated
    entryFee: 50,
    creatorId: "user456",
    participants: Array(15).fill(null).map((_,i) => ({id: `p${i}`, userId: `u${i}`, name: `Usuario ${i}`})), // Translated
    status: "completed",
    startDate: new Date(Date.now() - 86400000 * 40).toISOString(), 
    endDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    winnerId: "userparticipant7", // Could be "usuarioparticipante7" if IDs are also localized
    prizePool: 750,
    coverImageUrl: "https://placehold.co/600x300.png?text=Reductor+Cintura", // Translated
  },
];


export default function ChallengesPage() {
  // TODO: Implement search and filter logic
  const challenges = mockChallenges;

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <Zap className="h-8 w-8 mr-3 text-primary" /> Desafíos de Fitness
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Únete a desafíos existentes o crea los tuyos para competir y alcanzar tus metas.
            </CardDescription>
          </div>
          <Link href="/challenges/create" passHref legacyBehavior>
            <Button size="lg" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Nuevo Desafío
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar desafíos por nombre u objetivo..." className="pl-10" />
            </div>
            <Select defaultValue="active">
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Zap className="h-24 w-24 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-xl text-muted-foreground mb-2">No se encontraron desafíos.</p>
          <p className="text-foreground/70">¿Por qué no creas el primero?</p>
        </div>
      )}
    </div>
  );
}
