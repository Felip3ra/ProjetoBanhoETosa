import DayCell from "./DayCell";

interface CalendarGridProps {
  days: any[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function CalendarGrid({ days, selectedDate, onSelectDate }: CalendarGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => (
          <DayCell key={day ? day.date : index} day={day} selectedDate={selectedDate} onSelectDate={onSelectDate} />
        ))}
      </div>
    </>
  );
}
