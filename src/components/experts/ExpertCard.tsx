import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expert } from "@/types/domain";
import { Star, MessageSquare, Video, ArrowRight, ShieldCheck, Award } from "lucide-react";
import Link from "next/link";

interface ExpertCardProps {
  expert: Expert;
}

export default function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="border-border/60 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full bg-card/90 overflow-hidden relative group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 opacity-80" />
      
      <CardHeader className="items-center text-center p-6 pb-4">
        <div className="relative mb-3">
          <Avatar className="h-24 w-24 border-2 border-emerald-500/50 shadow-md group-hover:scale-105 transition-transform">
            <AvatarImage src={expert.avatarUrl} alt={expert.name} className="object-cover" />
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              {expert.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold p-1 rounded-full border-2 border-background" title="Verificado por Red Valkiria">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
        </div>

        <CardTitle className="text-xl font-black text-foreground">{expert.name}</CardTitle>
        <CardDescription className="text-emerald-400 font-bold text-xs uppercase tracking-wider mt-0.5">
          {expert.specialty}
        </CardDescription>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
            <Star className="h-3.5 w-3.5 mr-1 fill-current" /> {expert.rating.toFixed(1)}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {expert.experienceYears} años exp.
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-4 flex-grow space-y-3">
        <p className="text-xs text-foreground/85 leading-relaxed line-clamp-3">
          {expert.bio}
        </p>

        <div className="space-y-1.5 pt-2 border-t border-border/30">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Award className="h-3 w-3 text-emerald-400" /> Certificaciones
          </span>
          <div className="flex flex-wrap gap-1.5">
            {expert.certifications.slice(0, 2).map((cert) => (
              <Badge key={cert} variant="secondary" className="text-[10px] font-semibold bg-muted/60 border border-border/40">
                {cert}
              </Badge>
            ))}
            {expert.certifications.length > 2 && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                +{expert.certifications.length - 2} más
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 px-6 border-t border-border/30 bg-muted/20 flex items-center justify-between gap-2">
        <Link href={`/experts/${expert.id}`} className="w-full">
          <Button size="sm" className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-sm">
            Ver Perfil & Agendar <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
