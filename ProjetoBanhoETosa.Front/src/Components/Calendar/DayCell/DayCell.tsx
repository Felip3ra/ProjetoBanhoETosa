import styles from "./DayCell.module.css";
import type { DayCellProps } from "../../../interfaces/DayCell";


export default function DayCell({ day, selectedDate, onSelectDate }: DayCellProps) {
  if (!day) return <div className="aspect-square"></div>;

  const isSelected = day.date === selectedDate;

  // Define a classe principal do botão conforme o estado
  const buttonClass = `
    ${styles.cell} 
    ${isSelected ? styles.selected : day.count > 0 ? styles.hasData : styles.empty}
  `;

  return (
    <button key={day.date} onClick={() => onSelectDate(day.date)} className={buttonClass}>
      <div className={styles.dayNumber}>{day.day}</div>

      {day.count > 0 && (
        <div className={isSelected ? styles.countSelected : styles.count}>
          {day.count} 🐕
        </div>
      )}

      {day.revenue > 0 && (
        <div className={isSelected ? styles.revenueSelected : styles.revenue}>
          R${day.revenue}
        </div>
      )}
    </button>
  );
}
