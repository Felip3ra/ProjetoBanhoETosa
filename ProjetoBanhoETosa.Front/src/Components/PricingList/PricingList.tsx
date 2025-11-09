import { Scissors, Dog, Edit2 } from "lucide-react";
import type { PricingListProps } from "../../interfaces/PricingList";

export default function PricingList({ services,OpenModalEdit }: PricingListProps) {
  // Ícone por serviço
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("banho") && name.toLowerCase().includes("tosa")) return <Scissors className="w-5 h-5 text-purple-600" />;
    if (name.toLowerCase().includes("banho")) return <Dog className="w-5 h-5 text-blue-600" />;
    if (name.toLowerCase().includes("tosa")) return <Scissors className="w-5 h-5 text-orange-600" />;
    return null;
  };

  // Cor por serviço
  const getColor = (name: string) => {
    if (name.toLowerCase().includes("banho") && name.toLowerCase().includes("tosa")) return "text-purple-600";
    if (name.toLowerCase().includes("banho")) return "text-blue-600";
    if (name.toLowerCase().includes("tosa")) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between mb-3 items-start">
        <h3 className="font-bold text-gray-800 mb-4">Tabela de Preços</h3>
        {/* O botão de edição deve ser controlado pelo componente pai */}
        <button onClick={OpenModalEdit} className="text-blue-600 hover:text-blue-700">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              {getIcon(service.name)}
              <span className="text-gray-700">{service.name}</span>
            </div>
            <span className={`font-bold ${getColor(service.name)}`}>
              R$ {service.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}