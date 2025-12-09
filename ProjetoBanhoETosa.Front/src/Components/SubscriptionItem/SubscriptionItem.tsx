import React from "react";
import { AlertCircle } from "lucide-react";
import styles from "./SubscriptionItem.module.css";
import type { Subscription } from "../../services/subscriptionService";

interface SubscriptionItemProps {
  subscription: Subscription;
  onConfirmPayment: (subscription: Subscription) => void;
  confirmingPayment?: boolean;
}

export default function SubscriptionItem({ subscription, onConfirmPayment, confirmingPayment }: SubscriptionItemProps) {
  const nextPaymentDate = new Date(subscription.endDate);
  const daysLeft = Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  return (
    <div
      key={subscription.id}
      className={`${styles["Container-Payment"]} ${
        isExpired ? styles.Expired : isExpiring ? styles.Expiring : styles.Active
      }`}
    >
      <div className={styles["Container-Payment-Information"]}>
        <div>
          <h4 className={styles["Container-Payment-Customer"]}>{subscription.customerName}</h4>
          <p className={styles["Container-Payment-PlanName"]}>{subscription.planName}</p>
        </div>
        <span
          className={`${styles["Container-Payment-Status"]} ${
            subscription.paymentStatus === "pago" ? styles["Payment-Paid"] : styles["Payment-Pending"]
          }`}
        >
          {subscription.paymentStatus.toUpperCase()}
        </span>
      </div>

      <div className={styles["Container-Subscriptions"]}>
        <div>
          <span className={styles["Container-Subscriptions-Label"]}>Inicio:</span>
          <span className={styles["Container-Subscriptions-Value"]}>
            {new Date(subscription.startDate).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <div>
          <span className={styles["Container-Subscriptions-Label"]}>Termino:</span>
          <span className={styles["Container-Subscriptions-Value"]}>
            {new Date(subscription.endDate).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <div>
          <span className={styles["Container-Subscriptions-Label"]}>Servicos:</span>
          <span className={styles["Container-Subscriptions-Value"]}>
            {subscription.servicesUsed}/{subscription.servicesAvailable}
          </span>
        </div>
        <div>
          <span className={styles["Container-Subscriptions-Label"]}>Valor:</span>
          <span className={`${styles["Container-Subscriptions-Value"]} text-green-600`}>
            R$ {subscription.price.toFixed(2)}
          </span>
        </div>
        <div>
          <span className={styles["Container-Subscriptions-Label"]}>Proximo pagamento:</span>
          <span className={styles["Container-Subscriptions-Value"]}>
            {nextPaymentDate.toLocaleDateString("pt-BR")}{" "}
            {daysLeft >= 0 ? `(em ${daysLeft} dia${daysLeft === 1 ? "" : "s"})` : ""}
          </span>
        </div>
      </div>

      {isExpiring && subscription.paymentStatus === "pendente" && (
        <div className="flex items-center gap-2 text-yellow-700 text-sm mb-2">
          <AlertCircle className={styles["Icon-AlertCircle"]} />
          <span>Expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}</span>
        </div>
      )}

      {isExpired && (
        <div className={styles["Container-Alert"]}>
          <AlertCircle className={styles["Icon-AlertCircle"]} />
          <span>Vencido ha {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? "dia" : "dias"}</span>
        </div>
      )}

      {subscription.paymentStatus === "pendente" && (
        <button
          onClick={() => onConfirmPayment(subscription)}
          className={styles["Button-Confirm"]}
          disabled={confirmingPayment}
        >
          {confirmingPayment ? "Confirmando..." : "Confirmar Pagamento"}
        </button>
      )}
    </div>
  );
}
