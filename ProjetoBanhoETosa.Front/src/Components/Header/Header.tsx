import { Dog, User, LogOut,Edit2,CreditCard } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";
import type { HeaderProps } from "../../interfaces/Header";
export default function Header({onEditPrices,onShowPlans} : HeaderProps) {
     

const [subscriptions, setSubscriptions] = useState([
    { id: 1, customerName: 'Pedro Costa', planName: 'Plano Básico', startDate: '2025-10-01', endDate: '2025-10-31', price: 200, servicesUsed: 1, servicesAvailable: 4, paymentStatus: 'pago' },
    { id: 2, customerName: 'Ana Lima', planName: 'Plano Premium', startDate: '2025-10-05', endDate: '2025-11-05', price: 350, servicesUsed: 3, servicesAvailable: 8, paymentStatus: 'pendente' }
  ]);
  const getExpiringSubscriptions = () => {
    const today = new Date();
    return subscriptions.filter(sub => {
      const endDate = new Date(sub.endDate);
      const daysUntilExpiration = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 7 && daysUntilExpiration >= 0 && sub.paymentStatus === 'pendente';
    });
  };
  const expiringSubscriptions = getExpiringSubscriptions();
    return (
        <header className={styles.Header}>
            <div className={styles['Container-Header']}>
                <div className={styles['Container-Icon-Header']}>
                    <Dog className={styles['Icon-Dog']} />
                    <h1 className={styles['Icon-Tittle-Header']}>Petshop Banho e Tosa</h1>
                </div>
                <div className={styles['Container-Button']}>
                    <button
              onClick={onEditPrices}
              className={styles['btn-Edit-Prices']}
            >
              <Edit2 className={styles['btn-Edit-Prices-icon']} />
              <span>Preços</span>
            </button>
            <button
              onClick={onShowPlans}
              className={styles['btn-Show-Plans']}
            >
              <CreditCard className={styles['btn-Show-Plans-icon']} />
              <span>Planos</span>
              {expiringSubscriptions.length > 0 && (
                <span className={styles['Notification-Badge']}>
                  {expiringSubscriptions.length}
                </span>
              )}
            </button>
                    <User className={styles['Icon-User']} />
                    <span className="font-medium">Juliana</span>
                    <button

                    className={styles['btn-logout']}
                >
                    <LogOut className={styles['Icon-logout']} />
                    Sair
                </button>
                </div>
                
            </div>
        </header>
    );
}