"use client";

import { NutritionPlan } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, HeartPulse, Video, Calendar, ShieldCheck, ChevronRight, Apple } from "lucide-react";
import Link from "next/link";

interface ActiveNutritionPlanCardProps {
  plan?: NutritionPlan;
}

export function ActiveNutritionPlanCard({ plan }: ActiveNutritionPlanCardProps) {
  if (!plan) {
    return (
      <Card className="border-dashed border-2 border-border/70 p-6 text-center bg-card/50">
        <Utensils className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-bold">Aún no tienes un Plan Nutricional Asignado</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-4">
          Conéctate con un nutricionista o dietista certificado de la Red Valkiria para recibir tu prescripción personalizada.
        </p>
        <Link href="/experts" passHref>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            Explorar Nutricionistas Valkiria
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card to-emerald-950/10 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-black">{plan.title}</CardTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-extrabold">
                  <ShieldCheck className="h-3 w-3 mr-1 inline" /> Plan Verificado
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Prescrito por: <strong className="text-foreground">{plan.expertName}</strong>
              </CardDescription>
            </div>
          </div>

          <Link href="/experts" passHref>
            <Button size="sm" variant="outline" className="text-xs font-bold text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10">
              <Video className="h-3.5 w-3.5 mr-1.5" /> Consultar Nutriólogo
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Macros Summary Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Calorías</span>
            <p className="text-lg font-black text-amber-400">{plan.dailyCaloriesTarget}</p>
            <span className="text-[10px] text-muted-foreground">kcal/día</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] uppercase font-bold text-rose-400">Proteína</span>
            <p className="text-lg font-black text-rose-400">{plan.macros.proteinGrams}g</p>
            <span className="text-[10px] text-muted-foreground">Construcción</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] uppercase font-bold text-cyan-400">Carbos</span>
            <p className="text-lg font-black text-cyan-400">{plan.macros.carbsGrams}g</p>
            <span className="text-[10px] text-muted-foreground">Energía</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/80 border border-border/40">
            <span className="text-[10px] uppercase font-bold text-amber-500">Grasas</span>
            <p className="text-lg font-black text-amber-500">{plan.macros.fatsGrams}g</p>
            <span className="text-[10px] text-muted-foreground">Hormonal</span>
          </div>
        </div>

        {/* Guidelines / Recommendations */}
        <div className="p-3 rounded-xl bg-muted/40 border border-border/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Apple className="h-3.5 w-3.5 text-emerald-400" /> Pautas Clínicas Clave
          </h4>
          <ul className="space-y-1 text-xs text-foreground/90">
            {plan.guidelines.map((g, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Meals Schedule Preview */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Comidas Programadas para Hoy</h4>
          <div className="space-y-2">
            {plan.meals.slice(0, 2).map((meal, index) => (
              <div key={index} className="p-2.5 rounded-lg bg-background/60 border border-border/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 mr-2">{meal.time}</span>
                  <strong className="text-xs text-foreground">{meal.name}</strong>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{meal.description}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">
                  {meal.calories} kcal
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
