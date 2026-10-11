import { useState, useEffect, useCallback } from "react";
import type { Appointment } from "../interfaces/Appointment";
import { appointmentService } from "../services/appointmentService"; // Import the new service

interface UseAppointments {
  appointments: Appointment[];
  loading: boolean;
  isAdding: boolean;
  isDeleting: boolean;
  error: string | null;
  addAppointment: (newAppointmentData: Appointment) => Promise<boolean>;
  deleteAppointment: (id: number) => Promise<boolean>;
  refetchAppointments: () => Promise<void>;
}

export const useAppointments = (): UseAppointments => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAppointments = await appointmentService.getAllAppointments();
      setAppointments(fetchedAppointments);
    } catch (err: any) {
      console.error("Failed to fetch appointments:", err);
      setError(err.message || "Erro ao carregar agendamentos do servidor!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addAppointment = useCallback(async (newAppointmentData: Appointment): Promise<boolean> => {
    setIsAdding(true);
    setError(null);
    try {
      const addedAppointment = await appointmentService.addAppointment(newAppointmentData);
      setAppointments((prev) => [...prev, addedAppointment]);
      await fetchAppointments();
      return true;
    } catch (err: any) {
      console.error("Failed to add appointment:", err);
      setError(err.message || "Erro ao adicionar agendamento!");
      return false;
    } finally {
      setIsAdding(false);
    }
  }, [fetchAppointments]);

  const deleteAppointment = useCallback(async (id: number): Promise<boolean> => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) {
      return false;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await appointmentService.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      await fetchAppointments();
      return true;
    } catch (err: any) {
      console.error("Failed to delete appointment:", err);
      setError(err.message || "Erro ao excluir agendamento!");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchAppointments]);

  return { appointments, loading, isAdding, isDeleting, error, addAppointment, deleteAppointment, refetchAppointments: fetchAppointments };
};
