import { Dog, Clock, Scissors, DollarSign, Phone } from "lucide-react";
import type { Appointment } from "../../interfaces/Appointment";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface AppointmentCardProps {
  appointment: Appointment;
  onDelete: (id: number) => void;
}

export default function AppointmentCard({ appointment, onDelete }: AppointmentCardProps) {
  return (
    <Card className="border-slate-200/80">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Dog className="h-5 w-5 text-slate-600" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-slate-900">{appointment.petName}</h4>
              <span className="text-sm text-slate-500">({appointment.owner})</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4 text-slate-400" />
                {appointment.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Scissors className="h-4 w-4 text-slate-400" />
                {appointment.service}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-4 w-4 text-slate-400" />
                {appointment.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-slate-700">
            <DollarSign className="mr-1 h-3.5 w-3.5" />
            R$ {appointment.price.toFixed(2)}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => onDelete(appointment.id)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
