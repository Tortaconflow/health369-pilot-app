
"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface StepProps {
  control: Control<any>;
}

export default function StepAge({ control }: StepProps) {
  return (
    <FormField
      control={control}
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
  );
}
