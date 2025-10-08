
"use client";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/domain";
import { Award, Zap } from "lucide-react";

// Section component
function Section({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      {children}
    </div>
  );
}

// BadgesTab component
export default function BadgesTab({ userProfile }: { userProfile: UserProfile }) {
  return (
    <Section title="Insignias Ganadas">
      <div className="flex flex-wrap gap-3">
        {userProfile.badges.map(badge => (
          <Badge key={badge} className="px-4 py-2 text-sm bg-accent/20 text-accent-foreground border-2 border-accent hover:bg-accent/30 cursor-pointer transition-colors">
            <Award className="h-5 w-5 mr-2" />
            {badge}
          </Badge>
        ))}
        <Badge variant="outline" className="px-4 py-2 text-sm border-dashed border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
          <Zap className="h-5 w-5 mr-2" />
          Ver todas las insignias
        </Badge>
      </div>
    </Section>
  );
}
