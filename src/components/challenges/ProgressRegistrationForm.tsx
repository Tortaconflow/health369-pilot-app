"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Camera, FileText, UploadCloud, CheckCircle } from "lucide-react";
import PhotoUpload from "./PhotoUpload";
import { useToast } from "@/hooks/use-toast";
import { submitChallengeProgress } from "@/app/actions/challengeActions";
import { useState } from "react";
import type { AuthenticatePhotoOutput } from "@/ai/flows/photo-authentication";

const progressFormSchema = z.object({
  weight: z.coerce.number().positive("El peso debe ser un número positivo.").optional(),
  waist: z.coerce.number().positive("La medida de cintura debe ser positiva.").optional(),
  muscleMassPercentage: z.coerce.number().min(0).max(100, "El % de masa muscular debe estar entre 0-100.").optional(),
  notes: z.string().max(500, "Notas demasiado largas").optional(),
  // Photo upload will be handled separately but linked here
});

type ProgressFormValues = z.infer<typeof progressFormSchema>;

interface ProgressRegistrationFormProps {
  challengeId: string;
}

export default function ProgressRegistrationForm({ challengeId }: ProgressRegistrationFormProps) {
  const { toast } = useToast();
  const [uploadedPhotoInfo, setUploadedPhotoInfo] = useState<AuthenticatePhotoOutput | null>(null);
  
  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  async function onSubmit(data: ProgressFormValues) {
    if (!uploadedPhotoInfo?.watermarkedPhotoDataUri && (!data.weight && !data.waist && !data.muscleMassPercentage)) {
        toast({
            title: "Envío Incompleto",
            description: "Por favor, proporciona al menos un dato de progreso (medida o foto).",
            variant: "destructive",
        });
        return;
    }

    const progressData = {
      challengeId,
      // userId: "mockCurrentUserId", // Get from auth session
      ...data,
      photoDataUri: uploadedPhotoInfo?.watermarkedPhotoDataUri, // Add photo if available
      photoManipulationDetected: uploadedPhotoInfo?.manipulationDetected,
      photoDetectionDetails: uploadedPhotoInfo?.detectionDetails,
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await submitChallengeProgress(progressData);
      if (result.success) {
        toast({
          title: "¡Progreso Enviado!",
          description: "Tu progreso ha sido registrado exitosamente.",
          className: "bg-green-500 text-white",
          icon: <CheckCircle className="h-5 w-5" />,
        });
        form.reset();
        setUploadedPhotoInfo(null); 
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo enviar el progreso.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Error",
          description: "Ocurrió un error inesperado al enviar el progreso.",
          variant: "destructive",
        });
    }
  }

  return (
    <Card className="shadow-lg border-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <BarChart3 className="mr-3 h-7 w-7" /> Registra Tu Progreso
        </CardTitle>
        <CardDescription>
          Mantén actualizados los datos de tu desafío. ¡La constancia es la clave!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Ej: 70.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cintura (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Ej: 80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="muscleMassPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Masa Muscular (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Ej: 22.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4"/>Notas Opcionales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="¿Cómo te sientes? ¿Algún hito o dificultad?" {...field} className="min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="flex items-center mb-2"><Camera className="mr-2 h-4 w-4"/>Foto de Progreso</FormLabel>
              <PhotoUpload 
                onPhotoAuthenticated={setUploadedPhotoInfo} 
                currentPhotoInfo={uploadedPhotoInfo}
              />
              <FormDescription className="mt-2">
                Sube una nueva foto para hoy. Las fotos llevan marca de agua y se verifica su autenticidad.
              </FormDescription>
            </div>

            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <UploadCloud className="mr-2 h-5 w-5" /> Enviar Progreso
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
