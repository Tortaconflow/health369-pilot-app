import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expert } from "@/types/domain";
import { Star, MessageSquare, Video, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExpertCardProps {
  expert: Expert;
}

export default function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
          <AvatarImage src={expert.avatarUrl || `https://placehold.co/150x150.png?text=${expert.name.substring(0,1)}`} alt={expert.name} data-ai-hint="expert avatar" />
          <AvatarFallback className="text-2xl">{expert.name.substring(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-semibold text-primary">{expert.name}</CardTitle>
        <CardDescription className="text-accent font-medium">{expert.specialty}</CardDescription>
        <div className="flex items-center mt-1 text-yellow-500">
          <Star className="h-5 w-5 mr-1 fill-current" /> {expert.rating.toFixed(1)}
          <span className="text-muted-foreground ml-1 text-sm">({expert.experienceYears} años exp.)</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-4">{expert.bio}</p>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-foreground">Certificaciones:</h4>
          <div className="flex flex-wrap gap-1">
            {expert.certifications.slice(0, 2).map((cert) => (
              <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>
            ))}
            {expert.certifications.length > 2 && <Badge variant="outline" className="text-xs">+{expert.certifications.length - 2} más</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t flex flex-col sm:flex-row gap-2 justify-between">
        <Link href={`/experts/${expert.id}`} passHref legacyBehavior>
          <Button variant="outline" className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10">
            Ver Perfil <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" title="Chatear (próximamente)">
                <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" title="Videollamada (próximamente)">
                <Video className="h-5 w-5" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
