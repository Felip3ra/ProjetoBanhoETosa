import { useState, useCallback } from "react";
import { Appointment } from "../interfaces/Appointment";

interface Service {
    id: number;
    name: string;
    price: number;
    durationInMinutes: number;
  }

interface UseNewAppointmentForm {
  newAppointment: Appointment;
  setNewAppointment: (appointment: Appointment) => void;
  handleServiceChange: (serviceName: string) => void;
  resetForm: () => void;
}

export const useNewAppointmentForm = (services: Service[], initialDate: string): UseNewAppointmentForm => {
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    id: 0,
    petName: "",
    owner: "",
    service: "Banho e Tosa",
    time: "",
    price: 80,
    phone: "",
    date: initialDate,
    paymentMethod: "PIX"
  });

  const handleServiceChange = useCallback((serviceName: string) => {
    const selectedService = services.find((s) => s.name === serviceName);
    const price = selectedService ? selectedService.price : 80; // Default price if service not found
    setNewAppointment((prev) => ({ ...prev, service: serviceName, price }));
  }, [services]);

  const resetForm = useCallback(() => {
    setNewAppointment({
      id: 0,
      petName: "",
      owner: "",
      service: "Banho e Tosa",
      time: "",
      price: 80,
      phone: "",
      date: initialDate,
      paymentMethod: "PIX"
    });
  }, [initialDate]);

  return {
    newAppointment,
    setNewAppointment,
    handleServiceChange,
    resetForm
  };
};
