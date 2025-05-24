
"use client";
import type { Exercise } from "@/types/domain";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ExerciseItemProps {
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
}

export default function ExerciseItem({ exercise, isFirst, isLast }: ExerciseItemProps) {
  const formatDetail = () => {
    let details = [];
    if (exercise.sets && exercise.reps) details.push(`${exercise.sets}x${exercise.reps}`);
    else if (exercise.sets) details.push(`${exercise.sets} series`);
    else if (exercise.reps) details.push(`${exercise.reps} reps`);

    if (exercise.duration) details.push(exercise.duration);
    if (exercise.weight) details.push(exercise.weight);
    return details.join(', ');
  };

  return (
    <div className="relative flex items-start gap-4 py-4">
      {/* Vertical line connector */}
      {!isFirst && (
        <div className="absolute left-[calc(1.25rem_+_2px)] -top-4 bottom-[calc(50%_+_1rem)] w-0.5 bg-border -translate-x-1/2"></div>
      )}
      {!isLast && (
         <div className="absolute left-[calc(1.25rem_+_2px)] top-[calc(50%_+_1rem)] bottom-[-1rem] w-0.5 bg-border -translate-x-1/2"></div>
      )}
       <div className={cn(
        "absolute left-[calc(1.25rem_+_2px)] top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary z-10",
        isFirst && "top-[calc(50%_-_0.25rem)]", // Adjust for first item if no top line
        isLast && "bottom-[calc(50%_-_0.25rem)]" // Adjust for last item if no bottom line
      )}></div>


      <div className="flex-shrink-0">
        <Image
          src={exercise.imagePlaceholderUrl}
          alt={exercise.name}
          width={80}
          height={80}
          className="rounded-md object-cover w-20 h-20 border"
          data-ai-hint={exercise.dataAiHint || "exercise illustration"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-md font-semibold text-foreground truncate">{exercise.name}</p>
        <p className="text-sm text-muted-foreground">{formatDetail()}</p>
        {exercise.notes && <p className="text-xs text-primary/80 mt-0.5">{exercise.notes}</p>}
      </div>
    </div>
  );
}
