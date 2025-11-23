import React from "react";
import { AlertCircle } from "lucide-react";
import styles from "./SubscriptionItem.module.css";

interface Subscription {
  id: number;
  customerName: string;
  planName: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  servicesUsed: number;
  servicesAvailable: number;
  price: number;
}

interface SubscriptionItemProps {
  subscription: Subscription;
  onConfirmPayment: (subscriptionId: number) => void;
}

export default function SubscriptionItem({ subscription, onConfirmPayment }: SubscriptionItemProps) {
  const daysLeft = Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  return (
    <div
      key={subscription.id}
      className={`${styles['Container-Payment']} ${
        isExpired ? styles.Expired : isExpiring ? styles.Expiring : styles.Active
      }`}
    >
      <div className={styles['Container-Payment-Information']}>
        <div>
          <h4 className={styles['Container-Payment-Customer']}>{subscription.customerName}</h4>
          <p className={styles['Container-Payment-PlanName']}>{subscription.planName}</p>
        </div>
        <span
          className={`${styles['Container-Payment-Status']} ${
            subscription.paymentStatus === "pago" ? styles['Payment-Paid'] : styles['Payment-Pending']
          }`}
        >
          {subscription.paymentStatus.toUpperCase()}
        </span>
      </div>

      <div className={styles['Container-Subscriptions']}>
        <div>
          <span className={styles['Container-Subscriptions-Label']}>Início:</span>
          <span className={styles['Container-Subscriptions-Value']}>{new Date(subscription.startDate).toLocaleDateString("pt-BR")}</span>
        </div>
        <div>
          <span className={styles['Container-Subscriptions-Label']}>Término:</span>
          <span className={styles['Container-Subscriptions-Value']}>{new Date(subscription.endDate).toLocaleDateString("pt-BR")}</span>
        </div>
        <div>
          <span className={styles['Container-Subscriptions-Label']}>Serviços:</span>
          <span className={styles['Container-Subscriptions-Value']}>{subscription.servicesUsed}/{subscription.servicesAvailable}</span>
        </div>
        <div>
          <span className={styles['Container-Subscriptions-Label']}>Valor:</span>
          <span className={`${styles["Container-Subscriptions-Value"]} text-green-600`}>R$ {subscription.price.toFixed(2)}</span>
        </div>
      </div>

      {isExpiring && subscription.paymentStatus === "pendente" && (
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

      {subscription.paymentStatus === "pendente" && (
        <button
          onClick={() => onConfirmPayment(subscription.id)}
          className={styles['Button-Confirm']}
        >
          Confirmar Pagamento
        </button>
      )}
    </div>
  );
}