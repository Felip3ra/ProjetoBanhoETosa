import { useState, useEffect, useCallback } from "react";
import { Appointment } from "../interfaces/Appointment";

interface UseAppointments {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  addAppointment: (newAppointmentData: Appointment) => Promise<boolean>;
  deleteAppointment: (id: number) => Promise<boolean>;
  refetchAppointments: () => Promise<void>;
}

export const useAppointments = (): UseAppointments => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5159/api/Appointments/GetAllAppointments");
      if (!response.ok) {
        throw new Error("Erro ao carregar agendamentos");
      }
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Erro ao carregar agendamentos do servidor!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addAppointment = useCallback(async (newAppointmentData: Appointment): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5159/api/Appointments/NewAppointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointmentData),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar agendamento");
      }
      const data = await response.json();
      alert(data.message);
      setAppointments((prev) => [...prev, data.appointment]);
      return true;
    } catch (err) {
      console.error("Failed to add appointment:", err);
      setError("Erro ao adicionar agendamento!");
      return false;
    }
  }, []);

  const deleteAppointment = useCallback(async (id: number): Promise<boolean> => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) {
      return false;
    }
    try {
      const response = await fetch(`http://localhost:5159/api/Appointments/DeleteAppointment/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir agendamento");
      }
      const data = await response.json();
      alert(data.message);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      setError("Erro ao excluir agendamento!");
      return false;
    }
  }, []);

  return { appointments, loading, error, addAppointment, deleteAppointment, refetchAppointments: fetchAppointments };
};
