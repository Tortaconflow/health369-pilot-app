import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoIcon from '@/components/icons/LogoIcon';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-lg"> {/* Applied new radius */}
        <CardHeader className="text-center space-y-2">
           <Link href="/" className="inline-block no-underline"> {/* Ensure Link doesn't inherit global 'a' styles if not desired here */}
            <LogoIcon className="h-12 w-12 mx-auto" />
          </Link>
          {/* CardTitle is h2 by default -> Montserrat 18px. The text-3xl here will override it to a larger Montserrat. */}
          <CardTitle className="text-3xl font-bold text-primary">Crear Cuenta en Health369</CardTitle>
          <CardDescription>Únete a nuestra comunidad y comienza tu viaje de bienestar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SignupForm component would go here */}
           <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">Nombre Completo</label>
              <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring sm:text-sm" placeholder="Tu Nombre" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Correo Electrónico</label>
              <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring sm:text-sm" placeholder="tu@ejemplo.com" />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-foreground">Contraseña</label>
              <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring sm:text-sm" placeholder="••••••••" />
            </div>
          </div>
          {/* Primary button will use Naranja Vibrante (accent) */}
          <Button className="w-full">Regístrate</Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            {/* Link component will use global 'a' styles: Roboto 12px, text-secondary (Azul Suave) */}
            <Link href="/login" className="font-medium hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
