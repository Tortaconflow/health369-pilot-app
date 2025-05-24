"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChallengeParticipant } from "@/types/domain";
import { Users, UserCheck, ShieldQuestion } from "lucide-react";

interface ChallengeParticipantsProps {
  participants: ChallengeParticipant[];
}

export default function ChallengeParticipants({ participants }: ChallengeParticipantsProps) {
  if (!participants || participants.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-2"/>
          <CardTitle className="text-xl">No Participants Yet</CardTitle>
          <CardDescription>Be the first to join or invite others!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" /> Participants ({participants.length})
        </CardTitle>
        <CardDescription>See who's taking on the challenge.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={participant.avatarUrl || `https://placehold.co/50x50.png?text=${participant.name.substring(0,1)}`} alt={participant.name} data-ai-hint="participant avatar" />
                  <AvatarFallback>{participant.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground/90">{participant.name}</span>
              </div>
              {/* Placeholder for participant status or mini-progress */}
              <div className="text-xs text-muted-foreground flex items-center">
                {Math.random() > 0.5 ? <UserCheck className="h-4 w-4 text-green-500 mr-1" title="Progress Logged Recently"/> : <ShieldQuestion className="h-4 w-4 text-orange-400 mr-1" title="Awaiting Update"/>}
                {Math.random() > 0.5 ? 'Active' : 'Tracking'}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
