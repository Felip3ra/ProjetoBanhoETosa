import { useState, useEffect, useCallback } from "react";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  active: boolean;
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
      const response = await fetch("http://localhost:5159/api/Services/GetAllServices");
      if (!response.ok) {
        throw new Error("Erro ao carregar serviços");
      }
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Erro ao carregar serviços do servidor!");
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
      const response = await fetch(`http://localhost:5159/api/Services/UpdateService/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrice),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar serviço");
      }

      const data = await response.json();
      alert(data.message);

      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s)));
      return true;
    } catch (err) {
      console.error("Failed to update service price:", err);
      setError("Erro ao atualizar o serviço!");
      return false;
    }
  }, []);

  return { services, loading, error, updateServicePrice, refetchServices: fetchServices };
};
