export interface HeaderProps {
  onEditPrices: () => void;
  onShowPlans: () => void;
  onShowClients: () => void;
  onShowSubscriptionsPage?: () => void;
  userName?: string;
  onLogout?: () => void;
}
