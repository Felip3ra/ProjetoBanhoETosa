interface Service {
  id: number;
  name: string;
  price: number;
  durationInMinutes: number;
}

const API_BASE_URL = "/api";

export const serviceService = {
  getAllServices: async (): Promise<Service[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Services/GetAllServices`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.details ? `${error.message} (${error.details})` : error.message || "Erro ao carregar serviços");
      }
      const data = await response.json();
      return data.Services || data.services || [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  },

  updateServicePrice: async (serviceId: number, newPrice: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Services/UpdateService/${serviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrice),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.details ? `${error.message} (${error.details})` : error.message || "Erro ao atualizar serviço");
    }
  },

  createService: async (service: Omit<Service, "id">): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/Services/CreateService`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.details ? `${error.message} (${error.details})` : error.message || "Erro ao cadastrar serviço");
    }
    return response.json();
  },

  deleteService: async (serviceId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Services/DeleteService/${serviceId}`, {
      method: "DELETE",
    });
    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.details ? `${error.message} (${error.details})` : error.message || "Erro ao deletar serviço");
    }
  },
};
