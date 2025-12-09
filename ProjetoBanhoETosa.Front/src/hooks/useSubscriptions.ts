import { useState, useEffect, useCallback } from "react";
import {
  subscriptionService,
  type Subscription,
  type SubscriptionPayload,
} from "../services/subscriptionService";

interface UseSubscriptions {
  subscriptions: Subscription[];
  loading: boolean;
  isConfirmingPayment: boolean;
  isCreating: boolean;
  error: string | null;
  createSubscription: (subscription: SubscriptionPayload) => Promise<boolean>;
  confirmSubscriptionPayment: (subscription: Subscription) => Promise<boolean>;
  refetchSubscriptions: () => Promise<void>;
}

export const useSubscriptions = (): UseSubscriptions => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSubscriptions = await subscriptionService.getAllSubscriptions();
      setSubscriptions(fetchedSubscriptions);
    } catch (err: any) {
      console.error("Failed to fetch subscriptions:", err);
      setError(err.message || "Erro ao carregar assinaturas do servidor!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const createSubscription = useCallback(
    async (subscription: SubscriptionPayload): Promise<boolean> => {
      setIsCreating(true);
      setError(null);
      try {
        await subscriptionService.createSubscription({
          servicesUsed: 0,
          ...subscription,
        });
        await fetchSubscriptions();
        return true;
      } catch (err: any) {
        console.error("Failed to create subscription:", err);
        setError(err.message || "Erro ao criar assinatura!");
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchSubscriptions]
  );

  const confirmSubscriptionPayment = useCallback(async (subscription: Subscription): Promise<boolean> => {
    setIsConfirmingPayment(true);
    setError(null);
    try {
      await subscriptionService.confirmSubscriptionPayment({ ...subscription, paymentStatus: "pago" });
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === subscription.id ? { ...s, paymentStatus: "pago" } : s
        )
      );
      await fetchSubscriptions();
      return true;
    } catch (err: any) {
      console.error("Failed to confirm payment:", err);
      setError(err.message || "Erro ao confirmar pagamento!");
      return false;
    } finally {
      setIsConfirmingPayment(false);
    }
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    loading,
    isConfirmingPayment,
    isCreating,
    error,
    createSubscription,
    confirmSubscriptionPayment,
    refetchSubscriptions: fetchSubscriptions
  };
};
