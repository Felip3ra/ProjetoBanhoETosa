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

const API_BASE_URL = "http://localhost:5159/api";

export const subscriptionService = {
  getAllSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Subscriptions/GetAllSubscriptions`);
      if (!response.ok) {
        throw new Error("Erro ao carregar assinaturas");
      }
      const data = await response.json();
      return data.subscription || [];
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return []; // Explicitly return an empty array on error
    }
  },

  confirmSubscriptionPayment: async (subscriptionId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/Subscriptions/ConfirmPayment/${subscriptionId}`,
      { method: "PUT" }
    );
    if (!response.ok) {
      throw new Error("Erro ao confirmar pagamento");
    }
    const data = await response.json();
    alert(data.message); // Assuming backend sends a message for success
  },
};
