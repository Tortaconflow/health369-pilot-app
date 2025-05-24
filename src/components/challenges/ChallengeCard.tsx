import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Challenge } from "@/types/domain";
import { ArrowRight, CalendarDays, Users, Target, Zap, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const getStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden">
      <CardHeader className="p-0 relative">
        <Image
          src={challenge.coverImageUrl || `https://placehold.co/600x300.png?text=${encodeURIComponent(challenge.name)}`}
          alt={challenge.name}
          width={600}
          height={300}
          className="w-full h-48 object-cover"
          data-ai-hint="challenge theme"
        />
        <Badge className={cn("absolute top-3 right-3 px-2 py-1 text-xs font-semibold", getStatusColor(challenge.status))}>
          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
        </Badge>
         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
          <CardTitle className="text-2xl font-bold text-white leading-tight">{challenge.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardDescription className="text-sm text-foreground/80 mb-4 line-clamp-3">{challenge.description}</CardDescription>
        
        <div className="space-y-2 text-sm text-foreground/90">
          <InfoItem icon={<Target className="text-primary" />} label="Objective" value={challenge.objective} />
          <InfoItem icon={<Clock className="text-primary" />} label="Duration" value={challenge.duration} />
          <InfoItem icon={<Users className="text-primary" />} label="Participants" value={`${challenge.participants.length} joined`} />
          <InfoItem icon={<Zap className="text-primary" />} label="Entry Fee" value={`🪙 ${challenge.entryFee} coins`} />
          {challenge.status === 'upcoming' && (
             <InfoItem icon={<CalendarDays className="text-primary" />} label="Starts" value={new Date(challenge.startDate).toLocaleDateString()} />
          )}
          {challenge.status === 'active' && (
             <InfoItem icon={<CalendarDays className="text-primary" />} label="Ends" value={new Date(challenge.endDate).toLocaleDateString()} />
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <Link href={`/challenges/${challenge.id}`} passHref legacyBehavior>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center">
      <span className="flex-shrink-0 w-5 h-5 mr-2">{icon}</span>
      <span className="font-medium text-muted-foreground mr-1">{label}:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
