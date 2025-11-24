import type { Appointment } from "../interfaces/Appointment";

const API_BASE_URL = "http://localhost:5159/api";

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointments/GetAllAppointments`);
      if (!response.ok) {
        throw new Error("Erro ao carregar agendamentos");
      }
      const data = await response.json();
      return data.appointments || [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return []; // Explicitly return an empty array on error
    }
  },

  addAppointment: async (newAppointmentData: Appointment): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/Appointments/NewAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppointmentData),
    });
    if (!response.ok) {
      throw new Error("Erro ao adicionar agendamento");
    }
    const data = await response.json();
    alert(data.message); // Assuming backend sends a message for success
    return data.appointment;
  },

  deleteAppointment: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Appointments/DeleteAppointment/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao excluir agendamento");
    }
    const data = await response.json();
    alert(data.message); // Assuming backend sends a message for success
  },
};
