export type Service = {
  id: number;
  name: string;
  price: number;
  durationInMinutes: number;
};

export interface EditingPrice {
  services: Service[];
  onClose: () => void;
  onSave: (serviceId: number, newPrice: number) => void;
  onCreate: (service: Omit<Service, "id">) => void;
  onDelete: (serviceId: number) => void;
}
