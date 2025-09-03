
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Progress } from "@/components/ui/progress";

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
  height: z.coerce
    .number({ invalid_type_error: "La estatura debe ser un número." })
    .positive("La estatura debe ser un número positivo.")
    .min(50, "La estatura mínima es 50 cm / 1.64 ft.")
    .max(250, "La estatura máxima es 250 cm / 8.2 ft."),
  heightUnit: z.enum(["cm", "ft"], {
    required_error: "Selecciona la unidad de estatura.",
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

const totalSteps = 6; // Edad, Peso, Estatura, Género, Nivel Actividad, Meta Fitness

// Define los campos para cada paso para la validación
const stepFields: (keyof OnboardingFormValues)[][] = [
  ["age"],
  ["weight", "weightUnit"],
  ["height", "heightUnit"],
  ["gender"],
  ["activityLevel"],
  ["fitnessGoal"],
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      weightUnit: "kg",
      heightUnit: "cm",
      gender: undefined,
      activityLevel: undefined,
      fitnessGoal: undefined,
    },
    mode: "onChange", // Validar en cada cambio para habilitar/deshabilitar "Siguiente"
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    console.log("Onboarding data:", data);
    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "¡Perfil Completado!",
      description: "Tu información ha sido guardada. ¡Bienvenido/a a Health369!",
      className: "bg-green-500 text-white",
    });
    router.push("/dashboard");
    setIsSubmitting(false);
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const isValid = await form.trigger(fields);

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <UserPlus className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-2xl font-bold text-primary">¡Bienvenido/a a Health369!</CardTitle>
          {currentStep === 0 && (
            <CardDescription className="text-md text-muted-foreground px-2">
              Para que podamos ofrecerte una experiencia personalizada, por favor, cuéntanos un poco sobre ti. Con estos datos, podremos recomendarte los entrenamientos y consejos más adecuados para ayudarte a alcanzar tus metas.
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6 min-h-[300px]"> {/* Added min-h for consistent card size */}
          <div className="my-4">
            <Progress value={progressValue} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-center mt-2">Paso {currentStep + 1} de {totalSteps}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 0: Edad */}
              {currentStep === 0 && (
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">¿Cuál es tu edad? (años)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 28" {...field} className="text-base py-3"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 1: Peso */}
              {currentStep === 1 && (
                <div className="space-y-4">
                   <FormLabel className="text-lg">¿Cuál es tu peso actual?</FormLabel>
                   <div className="flex items-start gap-3">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                            <Input type="number" placeholder="Ej: 70" {...field} step="0.1" className="text-base py-3"/>
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
                             <FormLabel className="sr-only">Unidad de peso</FormLabel>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2 pt-2"
                            >
                                <FormItem className="flex items-center space-x-1.5 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="kg" id="kg" />
                                </FormControl>
                                <FormLabel htmlFor="kg" className="font-normal text-sm">kg</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-1.5 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="lb" id="lb" />
                                </FormControl>
                                <FormLabel htmlFor="lb" className="font-normal text-sm">lb</FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                   </div>
                </div>
              )}

              {/* Step 2: Estatura */}
              {currentStep === 2 && (
                 <div className="space-y-4">
                   <FormLabel className="text-lg">¿Cuál es tu estatura?</FormLabel>
                   <div className="flex items-start gap-3">
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                            <Input type="number" placeholder="Ej: 175" {...field} step="0.1" className="text-base py-3"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="heightUnit"
                        render={({ field }) => (
                        <FormItem className="shrink-0">
                            <FormLabel className="sr-only">Unidad de estatura</FormLabel>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2 pt-2"
                            >
                                <FormItem className="flex items-center space-x-1.5 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="cm" id="cm" />
                                </FormControl>
                                <FormLabel htmlFor="cm" className="font-normal text-sm">cm</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-1.5 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="ft" id="ft" />
                                </FormControl>
                                <FormLabel htmlFor="ft" className="font-normal text-sm">ft</FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                   </div>
                </div>
              )}

              {/* Step 3: Género */}
              {currentStep === 3 && (
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg">¿Cuál es tu género?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 pt-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="hombre" id="hombre"/>
                            </FormControl>
                            <FormLabel htmlFor="hombre" className="font-normal text-base">Hombre</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mujer" id="mujer"/>
                            </FormControl>
                            <FormLabel htmlFor="mujer" className="font-normal text-base">Mujer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no_decir" id="no_decir"/>
                            </FormControl>
                            <FormLabel htmlFor="no_decir" className="font-normal text-base">Prefiero no decirlo</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 4: Nivel de Actividad */}
              {currentStep === 4 && (
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">¿Cuál es tu nivel de actividad física habitual?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base py-3 h-auto">
                            <SelectValue placeholder="Selecciona tu nivel de actividad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentario" className="text-base">Sedentario (poco o ningún ejercicio)</SelectItem>
                          <SelectItem value="moderadamente_activo" className="text-base">Moderadamente activo (ejercicio ligero 1-3 días/semana)</SelectItem>
                          <SelectItem value="activo" className="text-base">Activo (ejercicio moderado 3-5 días/semana)</SelectItem>
                          <SelectItem value="muy_activo" className="text-base">Muy activo (ejercicio intenso 6-7 días/semana)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 5: Meta de Fitness */}
              {currentStep === 5 && (
                <FormField
                  control={form.control}
                  name="fitnessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">¿Cuál es tu meta principal de fitness?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base py-3 h-auto">
                            <SelectValue placeholder="Selecciona tu objetivo principal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="perder_peso" className="text-base">Perder peso</SelectItem>
                          <SelectItem value="mantener_peso" className="text-base">Mantener peso</SelectItem>
                          <SelectItem value="aumentar_masa_muscular" className="text-base">Aumentar masa muscular</SelectItem>
                          <SelectItem value="mejorar_salud_general" className="text-base">Mejorar la salud general</SelectItem>
                          <SelectItem value="mejorar_resistencia" className="text-base">Mejorar resistencia y rendimiento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Botones de Navegación se mueven a CardFooter */}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={handleBack} size="lg" className="text-base">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Atrás
            </Button>
          )}
          {currentStep < totalSteps - 1 && (
            <Button type="button" onClick={handleNext} size="lg" className="ml-auto text-base bg-primary hover:bg-primary/90 text-primary-foreground">
              Siguiente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {currentStep === totalSteps - 1 && (
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              size="lg"
              className="ml-auto text-base bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? "Guardando..." : "Aceptar y Finalizar"}
              {!isSubmitting && <CheckCircle className="ml-2 h-5 w-5" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
