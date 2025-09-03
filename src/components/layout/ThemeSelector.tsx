
"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Palette, Laptop } from "lucide-react"; // Added Laptop for system theme
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThemeSelector() {
  const { theme, setTheme, themeVariant, setThemeVariant } = useTheme();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Palette className="mr-2 h-5 w-5" />
          Personalizar Apariencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Modo de Color</Label>
          <div className="flex items-center space-x-2 rounded-lg border p-3">
            <Sun className="h-5 w-5" />
            <Label htmlFor="theme-switch" className="flex-grow">Claro / Oscuro</Label>
            <Switch
              id="theme-switch"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <Moon className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Variación de Diseño</Label>
          <RadioGroup
            value={themeVariant}
            onValueChange={(value) => setThemeVariant(value as typeof themeVariant)}
            className="grid grid-cols-1 gap-2"
          >
            {[
              { value: "standard", label: "Estándar" },
              { value: "minimalist", label: "Minimalista" },
              { value: "vibrante", label: "Vibrante" },
            ].map((variant) => (
              <Label
                key={variant.value}
                htmlFor={`variant-${variant.value}`}
                className={`flex items-center space-x-3 rounded-md border p-3 hover:bg-accent/10 cursor-pointer transition-colors
                  ${themeVariant === variant.value ? 'border-primary ring-2 ring-primary bg-accent/5' : 'border-border'}`}
              >
                <RadioGroupItem value={variant.value} id={`variant-${variant.value}`} className="text-primary"/>
                <span className="font-medium">{variant.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Tus preferencias se guardan automáticamente.
        </p>
      </CardContent>
    </Card>
  );
}
