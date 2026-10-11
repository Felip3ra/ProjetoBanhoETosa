export interface Appointment {
  id: number;
  clientId?: number;
  subscriptionId?: number;
  petName: string;
  owner: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  phone: string;
  price: number;
  paymentMethod: string;
}

export interface AppointmentListProps {
  appointments: Appointment[];
  selectedDate: string;
  totalRevenue: number;
  onDelete: (id: number) => void;
}

export interface AddAppointmentModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newAppointment: Appointment;
  setNewAppointment: (value: Appointment) => void;
  handleServiceChange: (service: string) => void;
  clients?: import("../services/clientService").Client[];
  onSelectClient?: (clientId?: number) => void;
  selectedClientId?: number;
  autoFilledByPlan?: boolean;
}

export interface AmountMonthServicesProps{
    MonthAppointments: Appointment[]
}
