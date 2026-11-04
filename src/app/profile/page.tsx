import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Shield, Zap, Flame, Dumbbell, HeartPulse, Brain, Wind, Trophy, Utensils, Settings } from "lucide-react";
import ThemeSelector from "@/components/layout/ThemeSelector";
import { initialMockHeroProfile, getRankBadgeColor } from "@/lib/gamification";
import { HeroStatusCard } from "@/components/gamification/HeroStatusCard";
import { ActiveNutritionPlanCard } from "@/components/nutrition/ActiveNutritionPlanCard";
import { VisualHeroCanvas } from "@/components/gamification/VisualHeroCanvas";

export default function ProfilePage() {
  const hero = initialMockHeroProfile;
  const rankColors = getRankBadgeColor(hero.heroRank);
  const xpProgressPercentage = Math.round((hero.experiencePoints / hero.xpToNextLevel) * 100);

  const ranksList = [
    { name: "Iniciado", levelRange: "Lvl 1 - 5", desc: "Primeros pasos en la forja de tu superhéroe." },
    { name: "Guerrero Valkyrie", levelRange: "Lvl 6 - 15", desc: "Hábito consolidado, fuerza y resistencia en ascenso.", active: true },
    { name: "Campeón de Asgard", levelRange: "Lvl 16 - 30", desc: "Dominio de macros y alta capacidad cardiovascular." },
    { name: "Superhéroe Titán", levelRange: "Lvl 31 - 50", desc: "Composición corporal élite y disciplina inquebrantable." },
    { name: "Valkyria Suprema", levelRange: "Lvl 51+", desc: "La cúspide del rendimiento físico y mental." },
  ];

  return (
    <div className="container mx-auto py-6 max-w-5xl space-y-8">
      {/* 1. Visual Hero Canvas & Armor */}
      <VisualHeroCanvas profile={hero} />

      {/* 2. Hero RPG Master Status Card */}
      <HeroStatusCard profile={hero} />

      {/* 2. Tabs: Senda de Rangos, Plan Nutricional Valkiria, Ajustes */}
      <Tabs defaultValue="ranks" className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-card/80 border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="ranks" className="gap-2 font-bold text-xs">
            <Trophy className="h-4 w-4 text-amber-400" /> Senda de Rangos RPG
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="gap-2 font-bold text-xs">
            <Utensils className="h-4 w-4 text-emerald-400" /> Plan Nutricional
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 font-bold text-xs">
            <Settings className="h-4 w-4 text-muted-foreground" /> Ajustes & Apariencia
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Senda de Rangos */}
        <TabsContent value="ranks" className="mt-6 space-y-4">
          <Card className="border-border/60 shadow-lg">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Jerarquía de Rangos Heroicos
              </CardTitle>
              <CardDescription>
                Desbloquea nuevos rangos acumulando XP en tus entrenamientos, comidas y retos.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {ranksList.map((r) => (
                <div 
                  key={r.name} 
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    r.active 
                      ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30" 
                      : "bg-background/60 border-border/40 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${r.active ? "bg-amber-500 text-slate-950 font-black" : "bg-muted text-muted-foreground font-bold"}`}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-extrabold text-foreground">{r.name}</strong>
                        {r.active && (
                          <Badge className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                            Rango Actual
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold border-border/50 shrink-0">
                    {r.levelRange}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Plan Nutricional Asignado */}
        <TabsContent value="nutrition" className="mt-6">
          <ActiveNutritionPlanCard plan={hero.activeNutritionPlan} />
        </TabsContent>

        {/* Tab 3: Ajustes & Theme */}
        <TabsContent value="settings" className="mt-6 space-y-4">
          <Card className="border-border/60 shadow-lg">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-xl font-bold">Personalización & Apariencia</CardTitle>
              <CardDescription>Ajusta el tema visual de Valky.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">Tema Visual</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Alterna entre Modo Oscuro (Obsidian) y Modo Claro (Titanium).
                </p>
                <ThemeSelector />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
