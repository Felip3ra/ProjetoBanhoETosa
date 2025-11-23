import React from "react";
import { Plus } from "lucide-react";
import type { PlanManagement } from "../../../interfaces/PlanManagement";
import styles from "./PlanManagement.module.css";
import SubscriptionItem from "../../SubscriptionItem/SubscriptionItem"; // Import the new component

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
          {subscriptions.map((sub) => (
            <SubscriptionItem key={sub.id} subscription={sub} onConfirmPayment={onConfirmPayment} />
          ))}

          <button onClick={onClose} className={styles['Button-Close']}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}