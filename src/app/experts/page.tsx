import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Expert } from "@/types/domain";
import { Search, Utensils, ShieldCheck, Sparkles, HeartHandshake, Video, Users } from "lucide-react";
import ExpertCard from "@/components/experts/ExpertCard";
import { Badge } from "@/components/ui/badge";
import { mockExperts } from "@/lib/experts";

export default function ExpertsPage() {
  const experts = mockExperts;

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-card via-card to-emerald-950/20 border border-border/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Utensils className="h-64 w-64 text-emerald-400" />
        </div>

        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-bold gap-1 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Red Valkiria de Salud & Nutrición
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Profesionales Certificados a tu Alcance
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            La verdadera transformación combina entrenamiento heroico con respaldo clínico. Conéctate con nutriólogos y expertos verificados que prescribirán tu plan de alimentación directamente en tu perfil.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Video className="h-4 w-4 text-primary" /> Videollamadas 1 a 1
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <Utensils className="h-4 w-4 text-emerald-400" /> Planes de Macros Asignables
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <HeartHandshake className="h-4 w-4 text-rose-400" /> Seguimiento Clínico
            </span>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Directorio de Especialistas
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {experts.length} Profesionales Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </div>
  );
}
