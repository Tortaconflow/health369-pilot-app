
"use client";

import type { MachineInfo } from "@/types/domain";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Dumbbell } from "lucide-react";

interface MachineInfoCardProps {
  machine: MachineInfo;
}

export default function MachineInfoCard({ machine }: MachineInfoCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:shrink-0">
          <Image
            src={machine.imagePlaceholderUrl}
            alt={machine.name}
            width={250}
            height={250}
            className="h-48 w-full object-cover md:h-full md:w-60"
            data-ai-hint={machine.dataAiHint || "gym machine"}
          />
        </div>
        <div className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">{machine.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <p className="text-sm text-foreground/80 leading-relaxed">{machine.description}</p>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Músculos Trabajados:</h4>
              <div className="flex flex-wrap gap-2">
                {machine.affectedMuscleGroups.map((group) => (
                  <Badge key={group} variant="secondary" className="bg-primary/10 text-primary">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
            {machine.commonExercises && machine.commonExercises.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Ejercicios Comunes:</h4>
                 <ul className="list-disc list-inside pl-1 text-sm text-foreground/70 space-y-0.5">
                    {machine.commonExercises.map(ex => <li key={ex.id}>{ex.name}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
