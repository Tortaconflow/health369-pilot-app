import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Users, ShieldCheck, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl">
          Bienvenido a <span className="text-accent">Health369 Piloto</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-foreground/80">
          Tu viaje personalizado hacia la salud y el fitness óptimos comienza aquí. Conéctate con expertos, únete a desafíos emocionantes y alcanza tus metas como nunca antes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-primary" />}
          title="Desafíos Atractivos"
          description="Participa en desafíos de fitness transformadores, sigue tu progreso con fotos autenticadas y gana recompensas."
          href="/challenges"
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-primary" />}
          title="Conexiones con Expertos"
          description="Accede a un directorio de entrenadores y nutricionistas certificados. Obtén orientación personalizada a través de chat y videoconsultas."
          href="/experts"
        />
        <FeatureCard
          icon={<ShieldCheck className="h-10 w-10 text-primary" />}
          title="Perspectivas con IA"
          description="Benefíciate de sugerencias de recetas y rutinas impulsadas por IA, además de evaluaciones justas de desafíos y autenticación de fotos."
          href="/dashboard#ai-suggestions"
        />
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden rounded-lg"> {/* Applied new radius */}
        <div className="md:flex">
          <div className="md:shrink-0">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Viaje de fitness" 
              width={600} 
              height={400}
              className="h-64 w-full object-cover md:h-full md:w-72"
              data-ai-hint="fitness journey"
            />
          </div>
          <div className="p-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">¿Listo para Transformarte?</CardTitle> {/* This will be h1 style from globals.css -> Montserrat 24px. If CardTitle is not h1, it might need adjustment or CardTitle uses h2 styling by default. */}
              <CardDescription className="text-lg text-foreground/70 mt-2">
                Health369 Piloto te proporciona las herramientas, la comunidad y el apoyo experto que necesitas para tener éxito.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-foreground/90">
                <li className="flex items-center">
                  <Target className="h-5 w-5 text-accent mr-3" />
                  Establece y alcanza metas de salud medibles.
                </li>
                <li className="flex items-center">
                  <Zap className="h-5 w-5 text-accent mr-3" />
                  Experimenta la emoción de los desafíos gamificados.
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-accent mr-3" />
                  Conéctate con una comunidad de apoyo y profesionales.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-6">
              <Link href="/dashboard" passHref legacyBehavior>
                {/* Primary button will use Naranja Vibrante (accent) */}
                <Button size="lg" className="w-full md:w-auto"> 
                  Comenzar <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"> {/* Applied new radius */}
      <CardHeader className="items-center text-center">
        <div className="p-4 bg-accent/20 rounded-full mb-4">
          {icon}
        </div>
        {/* CardTitle is h2 by default -> Montserrat 18px */}
        <CardTitle className="text-2xl font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-foreground/80">{description}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href={href} passHref legacyBehavior>
          {/* Outline button will use Verde Esmeralda border */}
          <Button variant="outline" className="text-primary hover:text-primary-foreground">
            Saber Más <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
