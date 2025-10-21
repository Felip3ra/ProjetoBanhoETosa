interface DayCellProps {
  day: any;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DayCell({ day, selectedDate, onSelectDate }: DayCellProps) {
  if (!day) return <div className="aspect-square"></div>;

  const isSelected = day.date === selectedDate;

  return (
    <button
      key={day.date}
      onClick={() => onSelectDate(day.date)}
      className={`aspect-square p-2 rounded-lg text-center transition-all ${
        isSelected
          ? "bg-blue-600 text-white shadow-lg"
          : day.count > 0
          ? "bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="text-lg font-bold">{day.day}</div>
      {day.count > 0 && (
        <div className={`text-xs mt-1 ${isSelected ? "text-blue-200" : "text-blue-600"}`}>
          {day.count} 🐕
        </div>
      )}
      {day.revenue > 0 && (
        <div className={`text-xs font-semibold ${isSelected ? "text-green-200" : "text-green-600"}`}>
          R${day.revenue}
        </div>
      )}
    </button>
  );
}
