
"use client";

import type { Workout } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Zap } from "lucide-react";
import ExerciseItem from "./ExerciseItem";

interface WorkoutDisplayProps {
  workout: Workout;
}

export default function WorkoutDisplay({ workout }: WorkoutDisplayProps) {
  return (
    <Card className="shadow-xl overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              {workout.name}
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground mt-1">
              {workout.dayDescription} &bull; {workout.estimatedTime}
            </CardDescription>
          </div>
          {workout.progress !== undefined && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Progress value={workout.progress} className="w-24 h-2.5" />
              <span className="text-sm font-medium text-primary">{workout.progress}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative px-4 sm:px-6 py-6">
          {workout.exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              isFirst={index === 0}
              isLast={index === workout.exercises.length - 1}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 bg-muted/20 border-t">
        <Button size="lg" className="w-full text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlayCircle className="mr-2 h-6 w-6" />
          Empezar Entrenamiento
        </Button>
      </CardFooter>
    </Card>
  );
}
