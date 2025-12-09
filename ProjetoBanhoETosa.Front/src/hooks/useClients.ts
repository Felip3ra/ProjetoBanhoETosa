import { useCallback, useEffect, useState } from "react";
import { clientService, type ClientPayload, type ClientSummary, type Client } from "../services/clientService";

interface UseClients {
  loading: boolean;
  saving: boolean;
  error: string | null;
  summary: ClientSummary | null;
  clients: Client[];
  createClient: (payload: ClientPayload) => Promise<boolean>;
  refetchSummary: () => Promise<void>;
  refetchClients: () => Promise<void>;
}

export const useClients = (): UseClients => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ClientSummary | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getSummary();
      setSummary(data);
    } catch (err: any) {
      console.error("Failed to load client summary", err);
      setError(err?.message || "Erro ao carregar resumo de clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err: any) {
      console.error("Failed to load clients", err);
      setError(err?.message || "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = useCallback(
    async (payload: ClientPayload): Promise<boolean> => {
      setSaving(true);
      setError(null);
    try {
      await clientService.createClient(payload);
      await Promise.all([fetchSummary(), fetchClients()]);
      return true;
    } catch (err: any) {
      console.error("Failed to create client", err);
      setError(err?.message || "Erro ao cadastrar cliente");
      return false;
    } finally {
      setSaving(false);
    }
    },
    [fetchSummary, fetchClients]
  );

  return { loading, saving, error, summary, clients, createClient, refetchSummary: fetchSummary, refetchClients: fetchClients };
};
