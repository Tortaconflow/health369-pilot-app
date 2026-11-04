import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Expert } from "@/types/domain";
import { CalendarDays, MessageSquare, Star, Video, Briefcase, GraduationCap, ShieldCheck, CheckCircle2, Clock, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockExperts } from "@/lib/experts";
import { BookingModal } from "@/components/experts/BookingModal";

export default async function ExpertProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = mockExperts.find(e => e.id === id) || mockExperts[0];

  return (
    <div className="container mx-auto py-6 max-w-5xl space-y-6">
      <Link href="/experts" className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        ← Volver al Directorio de la Red Valkiria
      </Link>

      <Card className="border-border/60 shadow-xl overflow-hidden bg-card/90">
        {/* Cover Banner */}
        <div className="h-48 w-full bg-gradient-to-r from-emerald-900/60 via-slate-900 to-amber-900/40 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-bold gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Profesional Verificado Valkyrie
            </Badge>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 md:px-8 pb-8 relative -mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="flex items-end gap-5">
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-card shadow-2xl rounded-2xl">
                <AvatarImage src={expert.avatarUrl} alt={expert.name} className="object-cover" />
                <AvatarFallback className="text-3xl font-black bg-primary text-primary-foreground">
                  {expert.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 pb-1">
                <h1 className="text-2xl md:text-3xl font-black text-foreground">{expert.name}</h1>
                <p className="text-sm font-bold text-emerald-400">{expert.specialty}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Star className="h-3.5 w-3.5 mr-1 fill-current" /> {expert.rating.toFixed(1)} / 5.0
                  </span>
                  <span>•</span>
                  <span className="flex items-center font-medium">
                    <Briefcase className="h-3.5 w-3.5 mr-1" /> {expert.experienceYears} años de práctica clínica
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <BookingModal expert={expert} />
              <Button size="lg" variant="outline" className="border-border/60 font-bold">
                <MessageSquare className="mr-2 h-4 w-4" /> Mensaje Directo
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Bio & Approach */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-emerald-400" /> Filosofía de Nutrición & Enfoque
                </h2>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {expert.bio}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> Credenciales y Certificaciones Oficiales
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {expert.certifications.map((cert) => (
                    <li key={cert} className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs font-semibold text-foreground/90 flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-foreground">Lo que incluye la consulta con este profesional:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="p-3 rounded-xl bg-background/80 border border-border/40">
                    <strong className="text-foreground block mb-1">📋 Plan de Macros Integrado</strong>
                    Prescripción sincronizada directamente en tu dashboard de Valky369.
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/40">
                    <strong className="text-foreground block mb-1">🎥 Videollamada 45 min</strong>
                    Evaluación clínica de composición corporal, hábitos y suplementación.
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/40">
                    <strong className="text-foreground block mb-1">💬 Chat de Seguimiento</strong>
                    Resolución de dudas semanales y ajustes de calorías.
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/40">
                    <strong className="text-foreground block mb-1">⚡ Sinergia con Valky AI</strong>
                    Tus misiones diarias se sincronizan con las indicaciones del especialista en Valky.
                  </div>
                </div>
              </section>
            </div>

            {/* Right sidebar: Booking Info */}
            <div className="space-y-4">
              <Card className="border-border/60 bg-muted/20 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Consulta Inicial</span>
                  <span className="text-xl font-black text-foreground">$45 USD</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1.5 border-t border-border/30 pt-3">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Duración: 45 minutos
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-emerald-400" /> Próxima fecha: Mañana disponible
                  </div>
                </div>
                <Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                  Reservar Mi Sesión
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
