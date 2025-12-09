import type { Client } from "../services/clientService";
import type { Subscription, SubscriptionPayload } from "../services/subscriptionService";

export interface PlanManagement {
  subscriptions: Subscription[];
  clients: Client[];
  onClose: () => void;
  onConfirmPayment: (subscription: Subscription) => void;
  onCreateSubscription: (subscription: SubscriptionPayload) => Promise<boolean>;
  creatingSubscription?: boolean;
  confirmingPayment?: boolean;
}
