import type { Appointment } from "../interfaces/Appointment";

const API_BASE_URL = "/api";

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointments/GetAllAppointments`);
      if (!response.ok) {
        if (response.status === 404) {
          // API devolve 404 quando não há registros
          return [];
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.details || error.message || "Erro ao carregar agendamentos");
      }
      const data = await response.json();
      const raw = data.appointments || data.Appointments || [];
      return Array.isArray(raw)
        ? raw.map((a: any) => {
            const isoDate = a.date || a.Date || a.AppointmentDate || a.appointmentDate;
            const parsedDate = isoDate ? new Date(isoDate) : null;
            const date =
              parsedDate && !isNaN(parsedDate.getTime())
                ? parsedDate.toISOString().slice(0, 10)
                : "";
            const timeRaw =
              a.time ||
              a.Time ||
              a.appointmentTime ||
              a.AppointmentTime ||
              a.appointmentTimeString ||
              a.AppointmentTimeString;
            const time = typeof timeRaw === "string" ? timeRaw.slice(0, 5) : "";

            return {
              id: a.id ?? a.Id ?? 0,
              clientId: a.clientId ?? a.ClientId,
              subscriptionId: a.subscriptionId ?? a.SubscriptionId,
              petName: a.petName ?? a.PetName ?? "",
              owner: a.owner ?? a.OwnerName ?? "",
              service: a.service ?? a.ServiceName ?? a.serviceName ?? "",
              date,
              time,
              phone: a.phone ?? a.Phone ?? "",
              price: a.price ?? a.Price ?? 0,
              paymentMethod:
                a.paymentMethod ??
                a.PaymentMethod ??
                a.paymentMethodString ??
                a.PaymentMethodString ??
                "PIX",
            } as Appointment;
          })
        : [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  },

  addAppointment: async (newAppointmentData: Appointment): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/Appointments/NewAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppointmentData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.details || error.message || "Erro ao adicionar agendamento");
    }
    const data = await response.json().catch(() => ({}));
    const a = data.appointment || data.Appointment || {};
    const isoDate = a.date || a.Date || a.AppointmentDate || a.appointmentDate || newAppointmentData.date;
    const parsedDate = isoDate ? new Date(isoDate) : null;
    const date =
      parsedDate && !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString().slice(0, 10)
        : newAppointmentData.date;
    const timeRaw =
      a.time ||
      a.Time ||
      a.appointmentTime ||
      a.AppointmentTime ||
      a.appointmentTimeString ||
      a.AppointmentTimeString ||
      newAppointmentData.time;
    const time = typeof timeRaw === "string" ? timeRaw.slice(0, 5) : newAppointmentData.time;

    return {
      id: a.id ?? a.Id ?? newAppointmentData.id ?? 0,
      clientId: a.clientId ?? a.ClientId ?? newAppointmentData.clientId,
      subscriptionId: a.subscriptionId ?? a.SubscriptionId ?? newAppointmentData.subscriptionId,
      petName: a.petName ?? a.PetName ?? newAppointmentData.petName,
      owner: a.owner ?? a.OwnerName ?? newAppointmentData.owner,
      service: a.service ?? a.ServiceName ?? a.serviceName ?? newAppointmentData.service,
      date,
      time,
      phone: a.phone ?? a.Phone ?? newAppointmentData.phone,
      price: a.price ?? a.Price ?? newAppointmentData.price,
      paymentMethod:
        a.paymentMethod ??
        a.PaymentMethod ??
        a.paymentMethodString ??
        a.PaymentMethodString ??
        newAppointmentData.paymentMethod ??
        "PIX",
    };
  },

  deleteAppointment: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Appointments/DeleteAppointment/${id}`, {
      method: "DELETE",
    });
    if (response.status === 404) {
      // Já removido no servidor ou id inexistente
      return;
    }
    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao excluir agendamento");
    }
  },
};
