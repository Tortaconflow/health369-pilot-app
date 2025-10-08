
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CheckCircle, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Progress } from "@/components/ui/progress";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

// --- Schema Definitions ---
const stepSchemas = [
  z.object({
    age: z.coerce
      .number({ invalid_type_error: "La edad debe ser un número." })
      .int("La edad debe ser un número entero.")
      .positive("La edad debe ser un número positivo.")
      .min(12, "Debes tener al menos 12 años.")
      .max(120, "La edad parece incorrecta."),
  }),
  z.object({
    weight: z.coerce
      .number({ invalid_type_error: "El peso debe ser un número." })
      .positive("El peso debe ser un número positivo.")
      .min(20, "El peso mínimo es 20.")
      .max(300, "El peso máximo es 300."),
    weightUnit: z.enum(["kg", "lb"], {
      required_error: "Selecciona la unidad de peso.",
    }),
  }),
  z.object({
    height: z.coerce
      .number({ invalid_type_error: "La estatura debe ser un número." })
      .positive("La estatura debe ser un número positivo.")
      .min(50, "La estatura mínima es 50 cm / 1.64 ft.")
      .max(250, "La estatura máxima es 250 cm / 8.2 ft."),
    heightUnit: z.enum(["cm", "ft"], {
      required_error: "Selecciona la unidad de estatura.",
    }),
  }),
  z.object({
    gender: z.enum(["hombre", "mujer", "no_decir"], {
      required_error: "Selecciona tu género.",
    }),
  }),
  z.object({
    activityLevel: z.enum(
      ["sedentario", "moderadamente_activo", "activo", "muy_activo"],
      { required_error: "Selecciona tu nivel de actividad." }
    ),
  }),
  z.object({
    fitnessGoal: z.enum(
      [
        "perder_peso",
        "mantener_peso",
        "aumentar_masa_muscular",
        "mejorar_salud_general",
        "mejorar_resistencia",
      ],
      { required_error: "Selecciona tu meta de fitness." }
    ),
  }),
];

const onboardingFormSchema = stepSchemas.reduce((acc, schema) => acc.merge(schema), z.object({}));
type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

const totalSteps = stepSchemas.length;

// --- Step Component Definitions (using dynamic import) ---
const stepComponents = [
  dynamic(() => import('@/components/onboarding/StepAge'), { loading: () => <Skeleton className="h-[96px] w-full" /> }),
  dynamic(() => import('@/components/onboarding/StepWeight'), { loading: () => <Skeleton className="h-[96px] w-full" /> }),
  dynamic(() => import('@/components/onboarding/StepHeight'), { loading: () => <Skeleton className="h-[96px] w-full" /> }),
  dynamic(() => import('@/components/onboarding/StepGender'), { loading: () => <Skeleton className="h-[188px] w-full" /> }),
  dynamic(() => import('@/components/onboarding/StepActivityLevel'), { loading: () => <Skeleton className="h-[96px] w-full" /> }),
  dynamic(() => import('@/components/onboarding/StepFitnessGoal'), { loading: () => <Skeleton className="h-[96px] w-full" /> }),
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
    },
    mode: "onChange",
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    console.log("Onboarding data:", data);
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
    const fieldsToValidate = Object.keys(stepSchemas[currentStep].shape) as (keyof OnboardingFormValues)[];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <UserPlus className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-2xl font-bold text-primary">¡Bienvenido/a a Health369!</CardTitle>
          {currentStep === 0 && (
            <CardDescription className="text-md text-muted-foreground px-2">
              Para que podamos ofrecerte una experiencia personalizada, por favor, cuéntanos un poco sobre ti.
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6 min-h-[220px]">
          <div className="my-4">
            <Progress value={progressValue} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-center mt-2">Paso {currentStep + 1} de {totalSteps}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CurrentStepComponent control={form.control} />
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
