
"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepProps {
  control: Control<any>;
}

export default function StepWeight({ control }: StepProps) {
  return (
    <div className="space-y-4">
      <FormLabel className="text-lg">¿Cuál es tu peso actual?</FormLabel>
      <div className="flex items-start gap-3">
        <FormField
          control={control}
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
          control={control}
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
  );
}
