"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Flame, Droplets, Sun, Moon, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: any;
  enabled: boolean;
  color: string;
}

export function ValkyNotificationCenter() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "morning-boost",
      title: "🌅 Motivación Matutina & Plan del Día",
      desc: "Mensaje de Valky AI con tu objetivo de superhéroe del día y recomendación de desayuno.",
      time: "08:00 AM",
      icon: Sun,
      enabled: true,
      color: "text-amber-400"
    },
    {
      id: "hydration-alert",
      title: "💧 Recordatorio de Hidratación (2.5L)",
      desc: "Alertas periódicas para mantener tu energía y acelerar la recuperación muscular.",
      time: "Cada 3 horas",
      icon: Droplets,
      enabled: true,
      color: "text-cyan-400"
    },
    {
      id: "streak-shield",
      title: "🔥 Guardián de la Racha (Streak Shield)",
      desc: "Alerta vespertina si aún no has registrado tu entrenamiento o comida para no perder tu racha.",
      time: "06:30 PM",
      icon: Flame,
      enabled: true,
      color: "text-rose-500"
    },
    {
      id: "night-recovery",
      title: "🌙 Preparación para la Recuperación",
      desc: "Consejos de higiene del sueño y desconexión para maximizar la síntesis muscular.",
      time: "10:00 PM",
      icon: Moon,
      enabled: false,
      color: "text-purple-400"
    }
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        const nextState = !n.enabled;
        toast({
          title: nextState ? "Notificación Activada" : "Notificación Desactivada",
          description: `${n.title} ${nextState ? "programada con éxito." : "en pausa."}`,
        });
        return { ...n, enabled: nextState };
      }
      return n;
    }));
  };

  const testTriggerNotification = () => {
    toast({
      title: "⚡ Mensaje de Valky AI (Notificación en Vivo)",
      description: "¡Hola Alex! Llevas 14 días de racha impecables. Recuerda beber tu vaso de agua y hacer tus 15 min de fuerza hoy. ¡Tu superhéroe está subiendo a nivel 9!",
      className: "bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black border-2 border-amber-300 shadow-2xl",
    });
  };

  return (
    <Card className="border-border/60 shadow-lg bg-card/90">
      <CardHeader className="pb-3 border-b border-border/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Notificaciones & Acompañamiento Valky</CardTitle>
              <CardDescription className="text-xs">
                Alertas inteligentes y personalizadas para ayudarte a ser constante sin agobiarte.
              </CardDescription>
            </div>
          </div>

          <Button 
            onClick={testTriggerNotification} 
            size="sm" 
            variant="outline" 
            className="text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Probar Notificación
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-background/60 border border-border/40 hover:border-border transition-colors flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted/60 mt-0.5">
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{item.title}</span>
                  <Badge variant="secondary" className="text-[10px] font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.time}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>

            <Switch
              checked={item.enabled}
              onCheckedChange={() => toggleNotification(item.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
