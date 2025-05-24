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
  weight: z.coerce.number().positive("Weight must be a positive number.").optional(),
  waist: z.coerce.number().positive("Waist measurement must be positive.").optional(),
  muscleMassPercentage: z.coerce.number().min(0).max(100, "Muscle mass % must be between 0-100.").optional(),
  notes: z.string().max(500, "Notes too long").optional(),
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
            title: "Incomplete Submission",
            description: "Please provide at least one piece of progress data (measurement or photo).",
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
          title: "Progress Submitted!",
          description: "Your progress has been successfully logged.",
          className: "bg-green-500 text-white",
          icon: <CheckCircle className="h-5 w-5" />,
        });
        form.reset();
        setUploadedPhotoInfo(null); 
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit progress.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Error",
          description: "An unexpected error occurred while submitting progress.",
          variant: "destructive",
        });
    }
  }

  return (
    <Card className="shadow-lg border-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <BarChart3 className="mr-3 h-7 w-7" /> Log Your Progress
        </CardTitle>
        <CardDescription>
          Keep your challenge data up-to-date. Consistency is key!
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
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 70.5" {...field} />
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
                    <FormLabel>Waist (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 80" {...field} />
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
                    <FormLabel>Muscle Mass (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 22.5" {...field} />
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
                  <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4"/>Optional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How are you feeling? Any milestones or struggles?" {...field} className="min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="flex items-center mb-2"><Camera className="mr-2 h-4 w-4"/>Progress Photo</FormLabel>
              <PhotoUpload 
                onPhotoAuthenticated={setUploadedPhotoInfo} 
                currentPhotoInfo={uploadedPhotoInfo}
              />
              <FormDescription className="mt-2">
                Upload a new photo for today. Photos are watermarked and checked for authenticity.
              </FormDescription>
            </div>

            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <UploadCloud className="mr-2 h-5 w-5" /> Submit Progress
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
