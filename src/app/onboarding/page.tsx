
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const onboardingFormSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: "La edad debe ser un número." })
    .int("La edad debe ser un número entero.")
    .positive("La edad debe ser un número positivo.")
    .min(12, "Debes tener al menos 12 años.")
    .max(120, "La edad parece incorrecta."),
  weight: z.coerce
    .number({ invalid_type_error: "El peso debe ser un número." })
    .positive("El peso debe ser un número positivo.")
    .min(20, "El peso mínimo es 20.")
    .max(300, "El peso máximo es 300."),
  weightUnit: z.enum(["kg", "lb"], {
    required_error: "Selecciona la unidad de peso.",
  }),
  gender: z.enum(["hombre", "mujer", "no_decir"], {
    required_error: "Selecciona tu género.",
  }),
  activityLevel: z.enum(
    ["sedentario", "moderadamente_activo", "activo", "muy_activo"],
    {
      required_error: "Selecciona tu nivel de actividad.",
    }
  ),
  fitnessGoal: z.enum(
    [
      "perder_peso",
      "mantener_peso",
      "aumentar_masa_muscular",
      "mejorar_salud_general",
      "mejorar_resistencia",
    ],
    {
      required_error: "Selecciona tu meta de fitness.",
    }
  ),
});

type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      weightUnit: "kg",
      gender: undefined,
      activityLevel: undefined,
      fitnessGoal: undefined,
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    console.log("Onboarding data:", data);
    // Aquí es donde guardarías los datos en Firestore o tu backend
    // Por ahora, solo simulamos el guardado y mostramos un toast.

    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "¡Perfil Completado!",
      description: "Tu información ha sido guardada. ¡Bienvenido/a a Health369!",
      icon: <CheckCircle className="h-5 w-5" />,
      className: "bg-green-500 text-white",
    });
    router.push("/dashboard");
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <UserPlus className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-2xl font-bold text-primary">¡Bienvenido/a a Health369!</CardTitle>
          <CardDescription className="text-md text-muted-foreground px-2">
            Para que podamos ofrecerte una experiencia personalizada, por favor, cuéntanos un poco sobre ti. Con estos datos, podremos recomendarte los entrenamientos y consejos más adecuados para ayudarte a alcanzar tus metas.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad (años)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 28" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                   <FormLabel>Peso</FormLabel>
                   <div className="flex items-start gap-3">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                            <Input type="number" placeholder="Ej: 70" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weightUnit"
                        render={({ field }) => (
                        <FormItem className="shrink-0">
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2 pt-2"
                            >
                                <FormItem className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="kg" />
                                </FormControl>
                                <FormLabel className="font-normal text-xs">kg</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="lb" />
                                </FormControl>
                                <FormLabel className="font-normal text-xs">lb</FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                   </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Género</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hombre" />
                          </FormControl>
                          <FormLabel className="font-normal">Hombre</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mujer" />
                          </FormControl>
                          <FormLabel className="font-normal">Mujer</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no_decir" />
                          </FormControl>
                          <FormLabel className="font-normal">Prefiero no decirlo</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Actividad Física</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel de actividad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentario (poco o ningún ejercicio)</SelectItem>
                        <SelectItem value="moderadamente_activo">Moderadamente activo (ejercicio ligero 1-3 días/semana)</SelectItem>
                        <SelectItem value="activo">Activo (ejercicio moderado 3-5 días/semana)</SelectItem>
                        <SelectItem value="muy_activo">Muy activo (ejercicio intenso 6-7 días/semana)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fitnessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Principal de Fitness</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu objetivo principal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="perder_peso">Perder peso</SelectItem>
                        <SelectItem value="mantener_peso">Mantener peso</SelectItem>
                        <SelectItem value="aumentar_masa_muscular">Aumentar masa muscular</SelectItem>
                        <SelectItem value="mejorar_salud_general">Mejorar la salud general</SelectItem>
                        <SelectItem value="mejorar_resistencia">Mejorar resistencia y rendimiento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar y Continuar"}
                {!isSubmitting && <CheckCircle className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    