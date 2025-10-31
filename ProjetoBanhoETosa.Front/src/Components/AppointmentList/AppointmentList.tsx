import { Dog, Clock, Scissors, DollarSign } from "lucide-react";
import type {AppointmentListProps } from "../../interfaces/Appointment";
import styles from "./AppointmentList.module.css";



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
            <div key={apt.id} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.details}>
                  <div className={styles.header}>
                    <Dog className={styles.iconBlue} />
                    <h4 className={styles.petName}>{apt.petName}</h4>
                    <span className={styles.owner}>({apt.owner})</span>
                  </div>

                  <div className={styles.info}>
                    <span className="flex items-center gap-1">
                      <Clock className={styles.icon} />
                      {apt.time}
                    </span>

                    <span className="flex items-center gap-1">
                      <Scissors className={styles.icon} />
                      {apt.service}
                    </span>

                    <span className={styles.price}>
                      <DollarSign className={styles.icon} />
                      R$ {apt.price.toFixed(2)}
                    </span>

                    <span>📞 {apt.phone}</span>
                  </div>
                </div>

                <button onClick={() => onDelete(apt.id)} className={styles.cancelBtn}>
                  Cancelar
                </button>
              </div>
            </div>
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
