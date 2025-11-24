export interface PricingListProps {
  services: {
    id: number;
    name: string;
    price: number;
    durationInMinutes: number;
  }[];
  OpenModalEdit: () => void;
}