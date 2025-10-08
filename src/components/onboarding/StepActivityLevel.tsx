
"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepProps {
  control: Control<any>;
}

export default function StepActivityLevel({ control }: StepProps) {
  return (
    <FormField
      control={control}
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
  );
}
