export interface PricingListProps {
  services: {
    id: number;
    name: string;
    price: number;
    duration: number;
    active: boolean;
  }[];
  OpenModalEdit: () => void;
}