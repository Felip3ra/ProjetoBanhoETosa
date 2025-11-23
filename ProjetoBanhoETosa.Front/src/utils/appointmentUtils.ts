import { Appointment } from "../interfaces/Appointment";

interface ServiceCounts {
  [key: string]: number;
  "Banho e Tosa": number;
  "Banho": number;
  "Tosa": number;
  // Add other service types as needed
}

export const countServicesByType = (appointments: Appointment[]): ServiceCounts => {
  const counts: ServiceCounts = {
    "Banho e Tosa": 0,
    "Banho": 0,
    "Tosa": 0,
  };

  appointments.forEach(appointment => {
    if (counts.hasOwnProperty(appointment.service)) {
      counts[appointment.service]++;
    }
    // If you want to count other services, add them to the initial counts object
  });

  return counts;
};
