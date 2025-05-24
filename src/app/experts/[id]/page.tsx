import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Expert } from "@/types/domain";
import { CalendarDays, MessageSquare, Star, Video, Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - replace with actual data fetching for a single expert by ID
const mockExpert: Expert = {
  id: "expert1",
  name: "Dra. Emilia Campos", // Translated
  specialty: "Nutricionista",
  avatarUrl: "https://placehold.co/200x200.png",
  bio: "La Dra. Emilia Campos es una Dietista-Nutricionista Registrada (RDN) y Especialista Certificada en Nutrición (CNS) altamente aclamada con más de una década de experiencia en el campo de la nutrición clínica y el coaching de bienestar. Le apasiona empoderar a las personas para que alcancen sus metas de salud a través de estrategias dietéticas personalizadas y basadas en evidencia. La Dra. Campos se especializa en manejo de peso, nutrición deportiva y terapia dietética para condiciones crónicas. Su enfoque holístico considera no solo la comida, sino también los factores del estilo de vida para fomentar un bienestar sostenible. Contribuye activamente a la investigación en nutrición y es una ponente solicitada en conferencias de salud.", // Translated
  rating: 4.9,
  experienceYears: 10,
  certifications: ["Dietista-Nutricionista Registrada (RDN)", "Especialista Certificada en Nutrición (CNS)", "Especialista Certificada por la Junta en Dietética Deportiva (CSSD)"], // Translated
};

// This page will be dynamic based on the expert's ID
export default function ExpertProfilePage({ params }: { params: { id: string } }) {
  // In a real app, fetch expert data based on params.id
  const expert = mockExpert; 

  if (!expert) {
    return <div className="container mx-auto py-8 text-center">Experto no encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-4xl mx-auto shadow-xl overflow-hidden">
        <CardHeader className="p-0 relative">
          <Image 
            src="https://placehold.co/1200x300.png" 
            alt={`Imagen de portada de ${expert.name}`} 
            width={1200} 
            height={300}
            className="w-full h-48 md:h-60 object-cover"
            data-ai-hint="professional cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 transform translate-y-1/2">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background bg-background shadow-lg">
              <AvatarImage src={expert.avatarUrl || `https://placehold.co/200x200.png?text=${expert.name.substring(0,1)}`} alt={expert.name} data-ai-hint="expert profile" />
              <AvatarFallback className="text-4xl">{expert.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        
        {/* Spacer for translated avatar */}
        <div className="pt-20 md:pt-24"> 
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{expert.name}</CardTitle>
                <CardDescription className="text-xl text-accent font-medium mt-1">{expert.specialty}</CardDescription>
                <div className="flex items-center mt-2 text-yellow-500">
                  <Star className="h-5 w-5 mr-1 fill-current" /> {expert.rating.toFixed(1)}
                  <span className="text-muted-foreground ml-2 text-sm flex items-center">
                    <Briefcase className="h-4 w-4 mr-1.5" /> {expert.experienceYears} años de experiencia
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <MessageSquare className="mr-2 h-5 w-5" /> Chatear
                </Button>
                <Button variant="outline" size="lg" className="text-primary border-primary hover:bg-primary/10">
                  <Video className="mr-2 h-5 w-5" /> Reservar Videollamada
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            <section className="mb-6">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Sobre Mí</h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{expert.bio}</p>
            </section>

            <Separator className="my-6" />

            <section>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Certificaciones y Cualificaciones</h3>
              <ul className="space-y-2">
                {expert.certifications.map((cert) => (
                  <li key={cert} className="flex items-center text-foreground/90">
                    <GraduationCap className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Placeholder for services, schedule, reviews etc. */}
            <Separator className="my-6" />
            <section>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Disponibilidad</h3>
              <p className="text-muted-foreground">La información de disponibilidad y el calendario de reservas se mostrarán aquí. (Próximamente)</p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-10 w-10 text-primary mr-4" />
                <span className="text-lg">Consultar Mi Calendario</span>
              </div>
            </section>

          </CardContent>
        </CardHeader> {/* This closes the CardHeader that was misused for content placement for avatar effect */}
      </Card>
    </div>
  );
}
