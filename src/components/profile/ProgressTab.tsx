
"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { UserProfile } from "@/types/domain";
import { Camera } from "lucide-react";

// Section component
function Section({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      {children}
    </div>
  );
}

// StatDisplay component
function StatDisplay({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-background p-4 rounded-lg shadow border border-border hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-accent">{value}</p>
        </div>
    );
}

// ProgressTab component
export default function ProgressTab({ userProfile }: { userProfile: UserProfile }) {
  return (
    <>
      <Section title="Estadísticas Actuales">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatDisplay label="Peso" value={`${userProfile.progress?.weight || 'N/A'} kg`} />
          <StatDisplay label="Cintura" value={`${userProfile.progress?.waist || 'N/A'} cm`} />
          <StatDisplay label="Masa Muscular" value={`${userProfile.progress?.muscleMassPercentage || 'N/A'} %`} />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Última actualización: {new Date(userProfile.progress?.lastUpdated || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </Section>
      <Separator className="my-6" />
      <Section title="Fotos de Progreso">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Antes</h4>
            <Image src="https://placehold.co/300x400.png?text=Antes" alt="Foto Antes" width={300} height={400} className="rounded-lg shadow-md" data-ai-hint="progress photo" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Después (Ejemplo)</h4>
            <Image src="https://placehold.co/300x400.png?text=Despues" alt="Foto Después Ejemplo" width={300} height={400} className="rounded-lg shadow-md" data-ai-hint="progress photo" />
          </div>
        </div>
        <Button className="mt-4">
          <Camera className="mr-2 h-4 w-4" /> Subir Nueva Foto
        </Button>
      </Section>
    </>
  );
}
