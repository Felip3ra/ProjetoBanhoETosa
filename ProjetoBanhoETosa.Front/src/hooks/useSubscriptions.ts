import { useState, useEffect, useCallback } from "react";
import { subscriptionService } from "../services/subscriptionService"; // Import the new service

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

interface UseSubscriptions {
  subscriptions: Subscription[];
  loading: boolean;
  isConfirmingPayment: boolean;
  error: string | null;
  confirmSubscriptionPayment: (subscriptionId: number) => Promise<boolean>;
  refetchSubscriptions: () => Promise<void>;
}

export const useSubscriptions = (): UseSubscriptions => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);
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

  const confirmSubscriptionPayment = useCallback(async (subscriptionId: number): Promise<boolean> => {
    setIsConfirmingPayment(true);
    setError(null);
    try {
      await subscriptionService.confirmSubscriptionPayment(subscriptionId);
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === subscriptionId ? { ...s, paymentStatus: "pago" } : s
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

  return { subscriptions, loading, isConfirmingPayment, error, confirmSubscriptionPayment, refetchSubscriptions: fetchSubscriptions };
};
