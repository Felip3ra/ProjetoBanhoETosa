import type { AppointmentListProps } from "../../interfaces/Appointment";
import AppointmentCard from "../AppointmentCard/AppointmentCard";
import { Dog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export default function AppointmentList({
  appointments,
  selectedDate,
  totalRevenue,
  onDelete,
}: AppointmentListProps) {
  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <Card className="border-slate-200/80">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Agendamentos</p>
          <CardTitle className="text-lg">{formattedDate}</CardTitle>
        </div>
        <Badge variant="secondary" className="text-slate-700">
          Total do Dia: R$ {totalRevenue.toFixed(2)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
            <Dog className="h-6 w-6 text-slate-400" />
            <p>Nenhum agendamento para este dia</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt, index) => (
              <AppointmentCard key={`apt-${apt.id ?? "temp"}-${index}`} appointment={apt} onDelete={onDelete} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
