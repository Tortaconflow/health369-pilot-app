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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { createChallenge } from "@/app/actions/challengeActions"; // Server Action

const challengeFormSchema = z.object({
  name: z.string().min(5, "Challenge name must be at least 5 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  objective: z.string().min(5, "Objective must be at least 5 characters.").max(150),
  durationValue: z.coerce.number().int().positive("Duration must be a positive number."),
  durationUnit: z.enum(["days", "weeks", "months"]),
  startDate: z.date({ required_error: "Start date is required." }),
  entryFee: z.coerce.number().int().min(0, "Entry fee cannot be negative.").optional().default(0),
  // coverImageUrl: z.string().url("Must be a valid URL for cover image.").optional(),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

export default function ChallengeCreationForm() {
  const { toast } = useToast();
  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      objective: "",
      durationUnit: "days",
      entryFee: 0,
    },
  });

  async function onSubmit(data: ChallengeFormValues) {
    const duration = `${data.durationValue} ${data.durationUnit}`;
    const { durationValue, durationUnit, ...restOfData } = data;
    
    // Calculate end date based on start date and duration
    let endDate = new Date(data.startDate);
    if (data.durationUnit === "days") {
        endDate.setDate(endDate.getDate() + data.durationValue);
    } else if (data.durationUnit === "weeks") {
        endDate.setDate(endDate.getDate() + data.durationValue * 7);
    } else if (data.durationUnit === "months") {
        endDate.setMonth(endDate.getMonth() + data.durationValue);
    }

    const challengeDataForAction = {
        ...restOfData,
        duration,
        startDate: data.startDate.toISOString(),
        endDate: endDate.toISOString(),
        // These would come from authenticated user in real app
        creatorId: "mockUserId", 
        participants: [], 
        status: "upcoming" as const,
    };

    try {
      const result = await createChallenge(challengeDataForAction);
      if (result.success) {
        toast({
          title: "Challenge Created!",
          description: `"${data.name}" has been successfully created.`,
        });
        form.reset();
        // Potentially redirect: router.push(`/challenges/${result.data.id}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create challenge.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenge Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 30-Day Fitness Kickstart" {...field} />
              </FormControl>
              <FormDescription>A catchy name for your challenge.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe what this challenge is about..." {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="objective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Measurable Objective</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lose 5kg, Run 100km total, Meditate 15 mins daily" {...field} />
              </FormControl>
              <FormDescription>What's the primary goal of this challenge?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="durationValue"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Duration</FormLabel>
                <div className="flex gap-2">
                    <FormControl>
                        <Input type="number" placeholder="e.g., 30" {...field} className="w-24"/>
                    </FormControl>
                     <FormField
                        control={form.control}
                        name="durationUnit"
                        render={({ field: unitField }) => (
                            <select {...unitField} className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                            </select>
                        )}
                        />
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="entryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry Fee (Virtual Coins 🪙)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0 (Optional)" {...field} />
              </FormControl>
              <FormDescription>Optional cost to join. Winner takes the pot!</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add Cover Image Upload Later if needed */}
        {/* Add Invite Friends Functionality Later */}
        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Challenge
        </Button>
      </form>
    </Form>
  );
}
