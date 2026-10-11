import DayCell from "../DayCell/DayCell";
import type { CalendarGridProps } from "../../../interfaces/CalendarGrid";

export default function CalendarGrid({ days, selectedDate, onSelectDate }: CalendarGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <DayCell key={day ? day.date : index} day={day} selectedDate={selectedDate} onSelectDate={onSelectDate} />
        ))}
      </div>
    </>
  );
}
