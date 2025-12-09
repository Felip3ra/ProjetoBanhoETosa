export interface Subscription {
  id: number;
  customerName: string;
  phone: string;
  email?: string;
  planName: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  servicesUsed: number;
  servicesAvailable: number;
  price: number;
  paymentMethod: string;
}

export type SubscriptionPayload = Omit<Subscription, "id">;

const API_BASE_URL = "/api";

export const subscriptionService = {
  getAllSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Subscriptions/GetAllSubscriptions`);
      if (!response.ok) {
        throw new Error("Erro ao carregar assinaturas");
      }
      const data = await response.json();
      const list = data.subscription || data.subscriptions || data || [];
      if (!Array.isArray(list)) return [];
      return list.map((sub: any) => ({
        paymentMethod: sub.paymentMethod ?? "PIX",
        servicesUsed: sub.servicesUsed ?? 0,
        ...sub,
      }));
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return []; // Explicitly return an empty array on error
    }
  },

  createSubscription: async (subscription: SubscriptionPayload): Promise<Subscription> => {
    const response = await fetch(`${API_BASE_URL}/Subscriptions/CreateSubscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Erro ao criar assinatura");
    }
    const data = await response.json().catch(() => ({}));
    return data.Subscription || data.subscription || data;
  },

  confirmSubscriptionPayment: async (subscription: Subscription): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/Subscriptions/ConfirmPayment`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao confirmar pagamento");
    }
    try {
      const data = await response.json();
      if (data?.message) alert(data.message);
    } catch (_) {
      // Sem corpo: seguir silenciosamente
    }
  },
};
