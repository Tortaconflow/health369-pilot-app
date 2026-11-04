"use client";

import { useState } from "react";
import { Expert } from "@/types/domain";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  expert: Expert;
}

export function BookingModal({ expert }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Mañana, 10:00 AM");
  const [selectedType, setSelectedType] = useState("Evaluación Clínica Inicial & Macros");
  const { toast } = useToast();

  const handleConfirmBooking = () => {
    setOpen(false);
    toast({
      title: "🎉 ¡Consulta Agendada con Éxito! (+50 XP)",
      description: `Tu videollamada con ${expert.name} ha sido confirmada para ${selectedDate}. Recibirás el enlace en tu correo.`,
      className: "bg-emerald-600 text-white font-bold",
    });
  };

  const timeSlots = [
    "Mañana, 10:00 AM",
    "Mañana, 04:30 PM",
    "En 2 días, 11:00 AM",
    "En 2 días, 06:00 PM",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
          <Video className="mr-2 h-4 w-4" /> Agendar Consulta Online
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-card/95 backdrop-blur-md border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-bold gap-1">
              <ShieldCheck className="h-3 w-3" /> Red Valkiria Certificada
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold">Agendar Videoconsulta con {expert.name}</DialogTitle>
          <DialogDescription className="text-xs">
            Selecciona el horario y motivo de tu sesión personalizada de nutrición y salud.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Service Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Tipo de Asesoría:</label>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {["Evaluación Clínica Inicial & Macros", "Ajuste de Plan & Seguimiento Mensual"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedType === type
                      ? "bg-primary/15 border-primary text-foreground font-bold"
                      : "bg-background/60 border-border/50 text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <span>{type}</span>
                  {selectedType === type && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Horarios Disponibles */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Horarios Disponibles:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedDate(slot)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                    selectedDate === slot
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-background/60 border-border/50 text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[11px]">{slot}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border/20 pt-3">
          <Button onClick={handleConfirmBooking} className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
            Confirmar Reserva ($45 USD / 0 Monedas)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
