import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { CalendarHeaderProps } from "../../../interfaces/CalendarHeader";
import { Button } from "../../ui/button";

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddAppointment,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon" onClick={onPrevMonth} aria-label="Mês anterior">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="tracking-wide">
            {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}
          </span>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={onNextMonth} aria-label="Próximo mês">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button type="button" variant="brand" onClick={onAddAppointment}>
        <Plus className="h-4 w-4" />
        Novo Agendamento
      </Button>
    </div>
  );
}
