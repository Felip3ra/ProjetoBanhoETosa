import DayCell from "../DayCell/DayCell";
import styles from './CalendarGrid.module.css';
import type { CalendarGridProps } from "../../../interfaces/CalendarGrid";


export default function CalendarGrid({ days, selectedDate, onSelectDate }: CalendarGridProps) {
  return (
    <>
      <div className={styles['Container-Calendar-Grid']}>
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
          <div key={day} className={styles['Day-Cell-Header']}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles['Container-Days-Grid']}>
        {days.map((day, index) => (
          <DayCell key={day ? day.date : index} day={day} selectedDate={selectedDate} onSelectDate={onSelectDate} />
        ))}
      </div>
    </>
  );
}
