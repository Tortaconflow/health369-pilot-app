
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Apple, Calculator, ListChecks, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 2;

interface OnboardingData {
  usagePreference?: "plan" | "calories";
  strengthTraining?: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const progressValue = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle submission
      console.log("Onboarding data:", onboardingData);
      toast({
        title: "¡Guía Completada!",
        description: "Tu configuración inicial ha sido guardada.",
        icon: <CheckCircle className="h-5 w-5" />,
        className: "bg-green-500 text-white",
      });
      router.push("/dashboard"); // Navigate to dashboard or next page
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUsagePreference = (preference: "plan" | "calories") => {
    setOnboardingData((prev) => ({ ...prev, usagePreference: preference }));
    handleNext();
  };

  const handleStrengthTraining = (doesStrengthTraining: boolean) => {
    setOnboardingData((prev) => ({ ...prev, strengthTraining: doesStrengthTraining }));
    handleNext();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Guía de Configuración Inicial</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Personaliza tu experiencia en Health369.
          </CardDescription>
          <Progress value={progressValue} className="w-full mt-4 h-2" />
          <p className="text-sm text-muted-foreground mt-1">Paso {currentStep + 1} de {TOTAL_STEPS}</p>
        </CardHeader>

        <CardContent className="space-y-6 min-h-[300px]">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-foreground">¿Cómo deseas usar Health369?</h3>
              <Button
                className="w-full h-auto py-4 text-left justify-start text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handleUsagePreference("plan")}
              >
                <ListChecks className="mr-3 h-7 w-7 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Necesito un plan alimenticio</p>
                </div>
              </Button>
              <Button
                className="w-full h-auto py-4 text-left justify-start text-base bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleUsagePreference("calories")}
              >
                <Calculator className="mr-3 h-7 w-7 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Sólo necesito contar calorías o macronutrientes</p>
                </div>
              </Button>
               <div className="flex items-center justify-center mt-2 text-muted-foreground">
                <Apple className="mr-2 h-5 w-5" />
                <span>Ambas opciones incluyen seguimiento de hábitos.</span>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-foreground">¿Realizas entrenamientos de fuerza?</h3>
              <p className="text-sm text-muted-foreground text-center">
                Ejercicios que fortalecen tus músculos usando resistencia (pesas, bandas elásticas, máquinas o tu propio peso).
              </p>
              <Button
                variant="default"
                className="w-full h-12 text-base"
                onClick={() => handleStrengthTraining(true)}
              >
                Sí
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => handleStrengthTraining(false)}
              >
                No
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
          )}
          {/* The next button is implicitly handled by selections in this design,
              but a generic next button could be added if steps don't auto-advance.
              For the last step, a "Finalizar" button is shown.
           */}
          <div className="flex-grow"></div> {/* Spacer */}
          {currentStep === TOTAL_STEPS -1 && !onboardingData.strengthTraining && onboardingData.strengthTraining !== undefined && (
             <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Finalizar <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
           {currentStep === TOTAL_STEPS -1 && onboardingData.strengthTraining && (
             <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Finalizar <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

