type Subscription = {
  id: number;
  customerName: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  servicesUsed: number;
  servicesAvailable: number;
  paymentStatus: string;
};

export interface PlanManagement {
  subscriptions: Subscription[];
  onClose: () => void;
  onConfirmPayment: (id: number) => void;
}