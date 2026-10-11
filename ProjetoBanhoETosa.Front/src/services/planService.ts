export interface Plan {
  id?: number;
  name: string;
  description?: string | null;
  price: number;
  servicesAvailable: number;
}

const API_BASE_URL = "/api";

export const planService = {
  getAllPlans: async (): Promise<Plan[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Plans/GetAllPlans`);
      if (!response.ok) {
        throw new Error("Erro ao carregar planos");
      }
      const data = await response.json();
      return data.plans || data.Plans || [];
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  },

  createPlan: async (plan: Plan): Promise<Plan> => {
    const response = await fetch(`${API_BASE_URL}/Plans/CreatePlan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao criar plano");
    }
    return response.json();
  },

  updatePlan: async (id: number, plan: Partial<Plan>): Promise<Plan> => {
    const response = await fetch(`${API_BASE_URL}/Plans/UpdatePlan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao atualizar plano");
    }
    return response.json();
  },

  deletePlan: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Plans/DeletePlan/${id}`, {
      method: "DELETE",
    });
    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao deletar plano");
    }
  },
};
