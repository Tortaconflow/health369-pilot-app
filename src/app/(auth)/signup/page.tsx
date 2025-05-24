import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoIcon from '@/components/icons/LogoIcon';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
           <Link href="/" className="inline-block">
            <LogoIcon className="h-12 w-12 mx-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold text-primary">Crear Cuenta en Health369</CardTitle>
          <CardDescription>Únete a nuestra comunidad y comienza tu viaje de bienestar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SignupForm component would go here */}
           <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">Nombre Completo</label>
              <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Tu Nombre" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Correo Electrónico</label>
              <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="tu@ejemplo.com" />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-foreground">Contraseña</label>
              <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="••••••••" />
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Regístrate</Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
