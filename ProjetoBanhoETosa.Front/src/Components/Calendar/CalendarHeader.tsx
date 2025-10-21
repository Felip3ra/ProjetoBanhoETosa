import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddAppointment: () => void;
}

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddAppointment,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}
        </h2>
        <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onAddAppointment}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Novo Agendamento
      </button>
    </div>
  );
}
