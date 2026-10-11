import type { DayCellProps } from "../../../interfaces/DayCell";
import { cn } from "../../../lib/utils";

export default function DayCell({ day, selectedDate, onSelectDate }: DayCellProps) {
  if (!day) return <div className="aspect-square" />;

  const isSelected = day.date === selectedDate;

  const buttonClass = cn(
    "aspect-square rounded-lg p-2 text-left transition",
    isSelected
      ? "bg-blue-600 text-white shadow-lg"
      : day.count > 0
      ? "border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
      : "bg-slate-50 hover:bg-slate-100"
  );

  return (
    <button type="button" onClick={() => onSelectDate(day.date)} className={buttonClass}>
      <div className="text-lg font-semibold">{day.day}</div>

      {day.count > 0 && (
        <div className={cn("mt-1 text-xs", isSelected ? "text-blue-200" : "text-blue-600")}>
          {day.count} pets
        </div>
      )}

      {day.revenue > 0 && (
        <div className={cn("text-xs font-semibold", isSelected ? "text-green-200" : "text-green-600")}>
          R$ {day.revenue}
        </div>
      )}
    </button>
  );
}
