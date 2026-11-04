import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Users, ShieldCheck, Target, Shield, Utensils, Bot, Flame, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Nueva Generación Fitness RPG
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-tight">
          Transforma tu Cuerpo. <br />
          <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
            Forja tu Superhéroe.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <strong className="text-foreground">Valky</strong> fusiona el progreso RPG estilo Notion con la prescripción clínica de la <strong>Red Valkiria de Nutrición</strong> y coaching multimodal con Inteligencia Artificial.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base px-8 py-6 rounded-xl shadow-lg gap-2">
              Entrar al Centro de Comando (Hero HQ) <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/experts">
            <Button size="lg" variant="outline" className="font-bold text-base px-6 py-6 rounded-xl border-border/70 hover:bg-muted/40 gap-2">
              <Utensils className="h-5 w-5 text-emerald-400" /> Red de Nutricionistas
            </Button>
          </Link>
        </div>
      </header>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Pillar 1: Hero RPG */}
        <Card className="border-border/60 shadow-xl bg-gradient-to-b from-card to-rose-950/10 hover:border-rose-500/50 transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="p-6">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-black text-foreground">1. Hero RPG Engine</CardTitle>
            <CardDescription className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Inspirado en Notion Superhéroe
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Tus entrenamientos suben tus atributos de Fuerza, Resistencia, Agilidad y Disciplina. Desbloquea rangos desde *Iniciado* hasta *Valkyria Suprema*.
            </p>
            <Link href="/profile" className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1">
              Ver Atributos & Rangos →
            </Link>
          </CardContent>
        </Card>

        {/* Pillar 2: Valkiria Health Network */}
        <Card className="border-border/60 shadow-xl bg-gradient-to-b from-card to-emerald-950/10 hover:border-emerald-500/50 transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="p-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Utensils className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-black text-foreground">2. Red Valkiria de Salud</CardTitle>
            <CardDescription className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Nutrición Certificada & Asesoría
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Conecta con nutricionistas clínicos y deportivos verificados. Recibe planes de macros personalizados asignados directamente en tu app con videollamadas.
            </p>
            <Link href="/experts" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              Explorar Nutricionistas →
            </Link>
          </CardContent>
        </Card>

        {/* Pillar 3: Valky AI & Anti-Cheat Challenges */}
        <Card className="border-border/60 shadow-xl bg-gradient-to-b from-card to-amber-950/10 hover:border-amber-500/50 transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="p-6">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Bot className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-black text-foreground">3. Valky AI Multimodal</CardTitle>
            <CardDescription className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Gemini 2.0 & Desafíos con Fotos
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Generación en tiempo real de rutinas completas y recetas. Validación fotográfica con marcas de agua temporales para premiar transformaciones reales.
            </p>
            <Link href="/ai-chat" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              Hablar con Valky AI →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Banner CTA */}
      <div className="w-full rounded-2xl p-8 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-border/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-2xl font-black text-foreground">¿Listo para comenzar tu transformación?</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Únete a la comunidad de Valky y lleva tu salud al siguiente nivel.</p>
        </div>
        <Link href="/onboarding">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm px-6 py-5 rounded-xl shadow-md">
            Configurar Mi Superhéroe (Onboarding)
          </Button>
        </Link>
      </div>
    </div>
  );
}
