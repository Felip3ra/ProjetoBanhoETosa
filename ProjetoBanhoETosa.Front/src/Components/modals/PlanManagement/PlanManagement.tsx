import React from "react";
import { AlertCircle,Plus } from "lucide-react";
import type { PlanManagement } from "../../../interfaces/PlanManagement";
import styles from "./PlanManagement.module.css";

export default function PlanManagement({ subscriptions, onClose, onConfirmPayment }: PlanManagement) {
  return (
    <div className={styles.Container} onClick={onClose}>
      <div className={styles['Container-Background']} />
      <div
        className={styles['Container-Modal-Plan']}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles['Container-Header-Modal-Plan']}>
          <h3 className={styles['Container-Header-Modal-Plan-Tittle']}>Gerenciar Planos Mensais</h3>
          <button
        
        className={styles['Button-New-Plan']}
      >
        <Plus className={styles['Icon-Plus']} />
        Novo Plano
      </button>
        </div>
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isExpiring = daysLeft <= 7 && daysLeft >= 0;
            const isExpired = daysLeft < 0;

            return (
              <div
                key={sub.id}
                className={`${styles['Container-Payment']} ${
                  isExpired ? styles.Expired : isExpiring ? styles.Expiring : styles.Active
                }`}
              >
                <div className={styles['Container-Payment-Information']}>
                  <div>
                    <h4 className={styles['Container-Payment-Customer']}>{sub.customerName}</h4>
                    <p className={styles['Container-Payment-PlanName']}>{sub.planName}</p>
                  </div>
                  <span
                    className={`${styles['Container-Payment-Status']} ${
                      sub.paymentStatus === "pago" ? styles['Payment-Paid'] : styles['Payment-Pending']
                    }`}
                  >
                    {sub.paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className={styles['Container-Subscriptions']}>
                  <div>
                    <span className={styles['Container-Subscriptions-Label']}>Início:</span>
                    <span className={styles['Container-Subscriptions-Value']}>{new Date(sub.startDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div>
                    <span className={styles['Container-Subscriptions-Label']}>Término:</span>
                    <span className={styles['Container-Subscriptions-Value']}>{new Date(sub.endDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div>
                    <span className={styles['Container-Subscriptions-Label']}>Serviços:</span>
                    <span className={styles['Container-Subscriptions-Value']}>{sub.servicesUsed}/{sub.servicesAvailable}</span>
                  </div>
                  <div>
                    <span className={styles['Container-Subscriptions-Label']}>Valor:</span>
                    <span className={`${styles["Container-Subscriptions-Value"]} text-green-600`}>R$ {sub.price.toFixed(2)}</span>
                  </div>
                </div>

                {isExpiring && sub.paymentStatus === "pendente" && (
                  <div className="flex items-center gap-2 text-yellow-700 text-sm mb-2">
                    <AlertCircle className={styles['Icon-AlertCircle']} />
                    <span>Expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}</span>
                  </div>
                )}

                {isExpired && (
                  <div className={styles['Container-Alert']}>
                    <AlertCircle className={styles['Icon-AlertCircle']} />
                    <span>Vencido há {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? "dia" : "dias"}</span>
                  </div>
                )}

                {sub.paymentStatus === "pendente" && (
                  <button
                    onClick={() => onConfirmPayment(sub.id)}
                    className={styles['Button-Confirm']}
                  >
                    Confirmar Pagamento
                  </button>
                )}
              </div>
            );
          })}

          <button onClick={onClose} className={styles['Button-Close']}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}