import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AISuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  suggestion: string;
  description?: string;
}

export default function AISuggestionCard({ icon, title, suggestion, description }: AISuggestionCardProps) {
  return (
    <Card className="bg-muted/30 border-primary/30 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-primary/10 rounded-full text-primary">
            {icon || <Lightbulb className="h-6 w-6" />}
          </span>
          <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-foreground/90 mb-1">{suggestion}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
