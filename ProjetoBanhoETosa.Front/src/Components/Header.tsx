import { Dog, User, LogOut,Edit2,CreditCard } from "lucide-react";
import { useState } from "react";
interface HeaderProps {
  onEditPrices: () => void;
  onShowPlans: () => void;
}
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
        <header className="shadow bg-[#fff]">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Dog className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Petshop Banho e Tosa</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <button
              onClick={onEditPrices}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
            >
              <Edit2 className="w-4 h-4" />
              <span>Preços</span>
            </button>
            <button
              onClick={onShowPlans}
              className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative text-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>Planos</span>
              {expiringSubscriptions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {expiringSubscriptions.length}
                </span>
              )}
            </button>
                    <User className="w-5 h-5" />
                    <span className="font-medium">Juliana</span>
                    <button

                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
                </div>
                
            </div>
        </header>
    );
}