
"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepProps {
  control: Control<any>;
}

export default function StepGender({ control }: StepProps) {
  return (
    <FormField
      control={control}
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
  );
}
