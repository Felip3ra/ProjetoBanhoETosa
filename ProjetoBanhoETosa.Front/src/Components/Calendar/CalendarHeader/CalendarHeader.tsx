import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import style from "./CalendarHeader.module.css";
import type { CalendarHeaderProps } from "../../../interfaces/CalendarHeader";

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddAppointment,
}: CalendarHeaderProps) {
  return (
    <div className={style['Container-Calendar-Header']}>
      <div className={style['Container-buttons']}>
        <button onClick={onPrevMonth} className={style['Button-Prev-Month']}>
          <ChevronLeft className={style['Icon-ChevronLeft']}/>
        </button>
        <h2 className={style['Container-buttons-Tittle']}>
          <Calendar className={style['Icon-Calendar']}/>
          {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}
        </h2>
        <button onClick={onNextMonth} className={style['Button-Next-Month']}>
          <ChevronRight className={style['Icon-ChevronRight']} />
        </button>
      </div>

      <button
        onClick={onAddAppointment}
        className={style['Button-Add-Appointment']}
      >
        <Plus className={style['Icon-Plus']}/>
        Novo Agendamento
      </button>
    </div>
  );
}
