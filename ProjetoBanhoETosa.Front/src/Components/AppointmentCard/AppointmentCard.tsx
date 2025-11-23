import { Dog, Clock, Scissors, DollarSign } from "lucide-react";
import styles from "./AppointmentCard.module.css";
import { Appointment } from "../../interfaces/Appointment"; // Assuming Appointment interface is available

interface AppointmentCardProps {
  appointment: Appointment;
  onDelete: (id: number) => void;
}

export default function AppointmentCard({ appointment, onDelete }: AppointmentCardProps) {
  return (
    <div key={appointment.id} className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.details}>
          <div className={styles.header}>
            <Dog className={styles.iconBlue} />
            <h4 className={styles.petName}>{appointment.petName}</h4>
            <span className={styles.owner}>({appointment.owner})</span>
          </div>

          <div className={styles.info}>
            <span className="flex items-center gap-1">
              <Clock className={styles.icon} />
              {appointment.time}
            </span>

            <span className="flex items-center gap-1">
              <Scissors className={styles.icon} />
              {appointment.service}
            </span>

            <span className={styles.price}>
              <DollarSign className={styles.icon} />
              R$ {appointment.price.toFixed(2)}
            </span>

            <span>📞 {appointment.phone}</span>
          </div>
        </div>

        <button onClick={() => onDelete(appointment.id)} className={styles.cancelBtn}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
