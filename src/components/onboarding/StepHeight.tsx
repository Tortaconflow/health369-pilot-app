
"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepProps {
  control: Control<any>;
}

export default function StepHeight({ control }: StepProps) {
  return (
    <div className="space-y-4">
      <FormLabel className="text-lg">¿Cuál es tu estatura?</FormLabel>
      <div className="flex items-start gap-3">
        <FormField
          control={control}
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
          control={control}
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
  );
}
