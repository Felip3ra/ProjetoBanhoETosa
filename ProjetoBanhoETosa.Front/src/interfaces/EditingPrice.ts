export type Service = {
  id: number;
  name: string;
  price: number;
  duration: number;
  active?: boolean;
};

export interface EditingPrice {
  services: Service[];
  onClose: () => void;
  onSave: (serviceId: number, newPrice: number) => void;
}