interface Service {
  id: number;
  name: string;
  price: number;
  durationInMinutes: number;
}

const API_BASE_URL = "http://localhost:5159/api";

export const serviceService = {
  getAllServices: async (): Promise<Service[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Services/GetAllServices`);
      if (!response.ok) {
        throw new Error("Erro ao carregar serviços");
      }
      const data = await response.json();
      return data.services || [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return []; // Explicitly return an empty array on error
    }
  },

  updateServicePrice: async (serviceId: number, newPrice: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Services/UpdateService/${serviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrice),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar serviço");
    }
    const data = await response.json();
    alert(data.message); // Assuming backend sends a message for success
  },
};
