import { useState, useEffect, useCallback } from "react";

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
  error: string | null;
  confirmSubscriptionPayment: (subscriptionId: number) => Promise<boolean>;
  refetchSubscriptions: () => Promise<void>;
}

export const useSubscriptions = (): UseSubscriptions => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5159/api/Subscriptions/GetAllSubscriptions");
      if (!response.ok) {
        throw new Error("Erro ao carregar assinaturas");
      }
      const data = await response.json();
      setSubscriptions(data.subscription || []);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      setError("Erro ao carregar assinaturas do servidor!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const confirmSubscriptionPayment = useCallback(async (subscriptionId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `http://localhost:5159/api/Subscriptions/ConfirmPayment/${subscriptionId}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Erro ao confirmar pagamento");
      }

      const data = await response.json();
      alert(data.message);

      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === subscriptionId ? { ...s, paymentStatus: "pago" } : s
        )
      );
      return true;
    } catch (err) {
      console.error("Failed to confirm payment:", err);
      setError("Erro ao confirmar pagamento!");
      return false;
    }
  }, []);

  return { subscriptions, loading, error, confirmSubscriptionPayment, refetchSubscriptions: fetchSubscriptions };
};
