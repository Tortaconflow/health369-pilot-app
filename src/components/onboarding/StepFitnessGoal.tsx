
"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepProps {
  control: Control<any>;
}

export default function StepFitnessGoal({ control }: StepProps) {
  return (
    <FormField
      control={control}
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
  );
}
