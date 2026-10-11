import { useCallback, useEffect, useState } from "react";
import {
  clientService,
  type ClientPayload,
  type ClientSummary,
  type Client,
  type ClientUpdatePayload,
} from "../services/clientService";

interface UseClients {
  loading: boolean;
  saving: boolean;
  error: string | null;
  summary: ClientSummary | null;
  clients: Client[];
  createClient: (payload: ClientPayload) => Promise<boolean>;
  updateClient: (id: number, payload: ClientUpdatePayload) => Promise<boolean>;
  deleteClient: (id: number) => Promise<boolean>;
  refetchSummary: (silent?: boolean) => Promise<void>;
  refetchClients: (silent?: boolean) => Promise<void>;
}

export const useClients = (): UseClients => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ClientSummary | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const fetchSummary = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await clientService.getSummary();
      setSummary(data);
    } catch (err: any) {
      console.error("Failed to load client summary", err);
      setError(err?.message || "Erro ao carregar resumo de clientes");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const fetchClients = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err: any) {
      console.error("Failed to load clients", err);
      setError(err?.message || "Erro ao carregar clientes");
    } finally {
      if (!silent) setLoading(false);
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
        await Promise.all([fetchSummary(true), fetchClients(true)]);
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

  const updateClient = useCallback(async (id: number, payload: ClientUpdatePayload): Promise<boolean> => {
    setError(null);
    try {
      await clientService.updateClient(id, payload);
      setClients((prev) =>
        prev.map((client) => (client.id === id ? { ...client, ...payload } : client))
      );
      return true;
    } catch (err: any) {
      console.error("Failed to update client", err);
      setError(err?.message || "Erro ao atualizar cliente");
      return false;
    }
  }, []);

  const deleteClient = useCallback(
    async (id: number): Promise<boolean> => {
      setError(null);
      try {
        await clientService.deleteClient(id);
        setClients((prev) => prev.filter((client) => client.id !== id));
        await fetchSummary(true);
        return true;
      } catch (err: any) {
        console.error("Failed to delete client", err);
        setError(err?.message || "Erro ao excluir cliente");
        return false;
      }
    },
    [fetchSummary]
  );

  return {
    loading,
    saving,
    error,
    summary,
    clients,
    createClient,
    updateClient,
    deleteClient,
    refetchSummary: fetchSummary,
    refetchClients: fetchClients,
  };
};
