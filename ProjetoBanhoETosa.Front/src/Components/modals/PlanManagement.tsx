import React from "react";
import { AlertCircle,Plus } from "lucide-react";

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

interface Props {
  subscriptions: Subscription[];
  onClose: () => void;
  onConfirmPayment: (id: number) => void;
}

export default function PlanManagement({ subscriptions, onClose, onConfirmPayment }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-50" />
      <div
        className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 text-center">Gerenciar Planos Mensais</h3>
          <button
        
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Novo Plano
      </button>
        </div>
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isExpiring = daysLeft <= 7 && daysLeft >= 0;
            const isExpired = daysLeft < 0;

            return (
              <div
                key={sub.id}
                className={`p-4 border-2 rounded-lg ${
                  isExpired ? "border-red-300 bg-red-50" : isExpiring ? "border-yellow-300 bg-yellow-50" : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{sub.customerName}</h4>
                    <p className="text-sm text-gray-600">{sub.planName}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sub.paymentStatus === "pago" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sub.paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Início:</span>
                    <span className="font-semibold ml-1">{new Date(sub.startDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Término:</span>
                    <span className="font-semibold ml-1">{new Date(sub.endDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Serviços:</span>
                    <span className="font-semibold ml-1">{sub.servicesUsed}/{sub.servicesAvailable}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-semibold ml-1 text-green-600">R$ {sub.price.toFixed(2)}</span>
                  </div>
                </div>

                {isExpiring && sub.paymentStatus === "pendente" && (
                  <div className="flex items-center gap-2 text-yellow-700 text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}</span>
                  </div>
                )}

                {isExpired && (
                  <div className="flex items-center gap-2 text-red-700 text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Vencido há {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? "dia" : "dias"}</span>
                  </div>
                )}

                {sub.paymentStatus === "pendente" && (
                  <button
                    onClick={() => onConfirmPayment(sub.id)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    Confirmar Pagamento
                  </button>
                )}
              </div>
            );
          })}

          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-4">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}