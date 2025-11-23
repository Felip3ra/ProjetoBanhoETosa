import type { AppointmentListProps } from "../../interfaces/Appointment";
import styles from "./AppointmentList.module.css";
import AppointmentCard from "../AppointmentCard/AppointmentCard"; // Import the new component
import { Dog } from "lucide-react"; // Only Dog icon is needed here for empty state

export default function AppointmentList({
  appointments,
  selectedDate,
  totalRevenue,
  onDelete,
}: AppointmentListProps) {
  return (
    <div>
      <h3 className={styles.title}>
        Agendamentos de{" "}
        {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        })}
      </h3>

      {appointments.length === 0 ? (
        <div className={styles.empty}>
          <Dog className={styles.emptyIcon} />
          <p>Nenhum agendamento para este dia</p>
        </div>
      ) : (
        <div className={styles.list}>
          {appointments.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} onDelete={onDelete} />
          ))}

          <div className={styles.total}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total do Dia:</span>
              <span className={styles.totalValue}>R$ {totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
