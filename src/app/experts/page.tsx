import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expert } from "@/types/domain";
import { Search, Filter } from "lucide-react";
import ExpertCard from "@/components/experts/ExpertCard";

// Mock data - replace with actual data fetching
const mockExperts: Expert[] = [
  {
    id: "expert1",
    name: "Dra. Emilia Campos", // Translated
    specialty: "Nutricionista",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Nutricionista dedicada con más de 10 años de experiencia en planes de dieta personalizados y coaching de bienestar.", // Translated
    rating: 4.9,
    experienceYears: 10,
    certifications: ["Dietista-Nutricionista Registrada (RDN)", "Especialista Certificada en Nutrición (CNS)"], // Translated
  },
  {
    id: "expert2",
    name: "Juan Dávila", // Translated
    specialty: "Entrenador Personal",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Entrenador personal certificado enfocado en entrenamiento de fuerza y fitness funcional. Ayudando a clientes a alcanzar su máxima condición física.", // Translated
    rating: 4.7,
    experienceYears: 8,
    certifications: ["Entrenador Personal Certificado ACE", "Especialista Certificado en Fuerza y Acondicionamiento (CSCS)"], // Translated
  },
  {
    id: "expert3",
    name: "Sofía Lara", // Translated
    specialty: "Instructora de Yoga y Coach de Mindfulness",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Instructora de yoga experimentada que integra prácticas de mindfulness para el bienestar holístico.", // Translated
    rating: 4.8,
    experienceYears: 7,
    certifications: ["RYT 500", "Coach de Mindfulness Certificada"], // Translated
  },
   {
    id: "expert4",
    name: "Marcos Chen",
    specialty: "Coach de Rendimiento Deportivo",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Especializado en mejorar el rendimiento atlético a través de programas de entrenamiento personalizados y asesoramiento nutricional.", // Translated
    rating: 4.9,
    experienceYears: 12,
    certifications: ["CSCS", "Nutricionista Deportivo Certificado (CISSN)"], // Translated
  },
];

export default function ExpertsPage() {
  // TODO: Implement search and filter logic
  const experts = mockExperts;

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Conecta con Expertos</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Encuentra entrenadores, nutricionistas y coaches de bienestar verificados para guiarte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar expertos por nombre o especialidad..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Especialidades</SelectItem>
                <SelectItem value="nutritionist">Nutricionista</SelectItem>
                <SelectItem value="trainer">Entrenador Personal</SelectItem>
                <SelectItem value="yoga">Instructor de Yoga</SelectItem>
                <SelectItem value="mindfulness">Coach de Mindfulness</SelectItem>
                <SelectItem value="sports-performance">Rendimiento Deportivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {experts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No se encontraron expertos que coincidan con tus criterios.</p>
        </div>
      )}
    </div>
  );
}
