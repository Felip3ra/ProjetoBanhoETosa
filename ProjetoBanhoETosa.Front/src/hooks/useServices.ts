import { useState, useEffect, useCallback } from "react";
import { serviceService } from "../services/serviceService";

interface Service {
  id: number;
  name: string;
  price: number;
  durationInMinutes: number;
}

interface UseServices {
  services: Service[];
  loading: boolean;
  isUpdating: boolean;
  error: string | null;
  updateServicePrice: (serviceId: number, newPrice: number) => Promise<boolean>;
  addService: (service: Omit<Service, "id">) => Promise<boolean>;
  deleteService: (serviceId: number) => Promise<boolean>;
  refetchServices: () => Promise<void>;
}

export const useServices = (): UseServices => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedServices = await serviceService.getAllServices();
      const unique = Array.from(
        new Map(fetchedServices.map((s) => [s.id, s])).values()
      );
      setServices(unique);
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

    setIsUpdating(true);
    setError(null);
    try {
      await serviceService.updateServicePrice(serviceId, newPrice);
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s)));
      await fetchServices();
      return true;
    } catch (err: any) {
      console.error("Failed to update service price:", err);
      setError(err.message || "Erro ao atualizar o serviço!");
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchServices]);

  const addService = useCallback(async (service: Omit<Service, "id">): Promise<boolean> => {
    if (!service.name || service.price <= 0 || service.durationInMinutes <= 0) {
      alert("Preencha nome, preço e duração válidos.");
      return false;
    }

    setIsUpdating(true);
    setError(null);
    try {
      const created = await serviceService.createService(service);
      setServices((prev) => {
        const next = new Map(prev.map((s) => [s.id, s]));
        next.set(created.id, created);
        return Array.from(next.values());
      });
      await fetchServices();
      return true;
    } catch (err: any) {
      console.error("Failed to create service:", err);
      setError(err.message || "Erro ao criar serviço!");
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchServices]);

  const deleteService = useCallback(async (serviceId: number): Promise<boolean> => {
    if (!serviceId) return false;
    setIsUpdating(true);
    setError(null);
    try {
      await serviceService.deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      return true;
    } catch (err: any) {
      console.error("Failed to delete service:", err);
      setError(err.message || "Erro ao deletar serviço!");
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { services, loading, isUpdating, error, updateServicePrice, addService, deleteService, refetchServices: fetchServices };
};
