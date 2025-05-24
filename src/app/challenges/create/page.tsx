import ChallengeCreationForm from "@/components/challenges/ChallengeCreationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function CreateChallengePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-block p-3 bg-accent/20 rounded-full mx-auto mb-4">
            <Award className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Create a New Challenge</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Inspire yourself and others. Define your challenge and invite friends to join!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChallengeCreationForm />
        </CardContent>
      </Card>
    </div>
  );
}
