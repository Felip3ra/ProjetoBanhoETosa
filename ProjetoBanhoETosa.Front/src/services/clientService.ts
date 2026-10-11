export interface ClientPayload {
  name: string;
  phone: string;
  email?: string;
  petName: string;
}

export interface ClientUpdatePayload {
  name: string;
  phone: string;
  email?: string;
}

export interface ClientSummary {
  totalClients: number;
  totalPets: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  petName?: string;
  activePlanName?: string;
  activeSubscriptionId?: number;
  activePlanExpiresAt?: string;
}

const API_BASE_URL = "/api";

export const clientService = {
  createClient: async (payload: ClientPayload): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erro ao cadastrar cliente");
    }
  },

  updateClient: async (id: number, payload: ClientUpdatePayload): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erro ao atualizar cliente");
    }
  },

  deleteClient: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Clients/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erro ao excluir cliente");
    }
  },

  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Clients`);
      if (!response.ok) {
        throw new Error("Erro ao carregar clientes");
      }
      const data = await response.json().catch(() => []);
      const rawList = Array.isArray(data?.clients || data) ? (data.clients || data) : [];
      // Normaliza propriedades esperadas (API pode devolver PascalCase)
      return rawList.map((c: any) => ({
        id: c.id ?? c.Id,
        name: c.name ?? c.Name ?? "",
        phone: c.phone ?? c.Phone ?? "",
        email: c.email ?? c.Email,
        petName: c.petName ?? c.PetName,
        activePlanName: c.activePlanName ?? c.ActivePlanName,
        activeSubscriptionId: c.activeSubscriptionId ?? c.ActiveSubscriptionId,
        activePlanExpiresAt: c.activePlanExpiresAt ?? c.ActivePlanExpiresAt,
      } as Client));
    } catch (error) {
      console.warn("Lista de clientes indisponível", error);
      return [];
    }
  },

  getSummary: async (): Promise<ClientSummary> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Clients/GetSummary`);
      if (!response.ok) {
        throw new Error("Erro ao buscar resumo de clientes");
      }
      const data = await response.json().catch(() => ({}));
      return {
        totalClients: data?.totalClients ?? 0,
        totalPets: data?.totalPets ?? 0,
      };
    } catch (error) {
      // Se banco estiver vazio ou a API devolver erro/controlado, garanta zeros
      console.warn("Resumo de clientes indisponível, usando zeros", error);
      return { totalClients: 0, totalPets: 0 };
    }
  },
};
