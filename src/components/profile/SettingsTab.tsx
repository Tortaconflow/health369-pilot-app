
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ThemeSelector from "@/components/layout/ThemeSelector";
import type { UserProfile } from "@/types/domain";
import { Edit3, Shield } from "lucide-react";

// Section component
function Section({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      {children}
    </div>
  );
}

// SettingsTab component
export default function SettingsTab({ userProfile }: { userProfile: UserProfile }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title="Información de la Cuenta">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" defaultValue={userProfile.name} />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" defaultValue={userProfile.email} disabled />
            </div>
            <Button><Edit3 className="h-4 w-4 mr-2" />Guardar Cambios</Button>
          </div>
        </Section>

        <Section title="Apariencia">
          <ThemeSelector />
        </Section>
      </div>
      
      <Separator className="my-8" />

      <Section title="Seguridad">
        <Button variant="outline"><Shield className="h-4 w-4 mr-2" />Cambiar Contraseña</Button>
      </Section>
    </>
  );
}
