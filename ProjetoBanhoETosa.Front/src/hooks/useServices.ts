import { useState, useEffect, useCallback } from "react";
import { serviceService } from "../services/serviceService"; // Import the new service

interface Service {
  id: number;
  name: string;
  price: number;
  durationInMinutes: number;
}

interface UseServices {
  services: Service[];
  loading: boolean;
  error: string | null;
  updateServicePrice: (serviceId: number, newPrice: number) => Promise<boolean>;
  refetchServices: () => Promise<void>;
}

export const useServices = (): UseServices => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedServices = await serviceService.getAllServices();
      setServices(fetchedServices);
    } catch (err: any) {
      console.error("Failed to fetch services:", err);
      setError(err.message || "Erro ao carregar serviços do servidor!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateServicePrice = useCallback(async (serviceId: number, newPrice: number): Promise<boolean> => {
    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Por favor, insira um preço válido!");
      return false;
    }

    try {
      await serviceService.updateServicePrice(serviceId, newPrice);
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s)));
      return true;
    } catch (err: any) {
      console.error("Failed to update service price:", err);
      setError(err.message || "Erro ao atualizar o serviço!");
      return false;
    }
  }, []);

  return { services, loading, error, updateServicePrice, refetchServices: fetchServices };
};
