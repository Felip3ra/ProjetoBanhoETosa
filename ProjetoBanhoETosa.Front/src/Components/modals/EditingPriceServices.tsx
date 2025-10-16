import React, { useState } from "react";
import { Edit2, Check } from "lucide-react";

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number;
  active?: boolean;
};

interface Props {
  services: Service[];
  onClose: () => void;
  onSave: (serviceId: number, newPrice: number) => void;
}

export default function EditingPriceServices({ services, onClose, onSave }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setTempPrice(s.price.toString());
  };

  const handleSave = (serviceId: number) => {
    const price = parseFloat(tempPrice.replace(",", "."));
    if (isNaN(price) || price <= 0) {
      alert("Por favor, insira um preço válido!");
      return;
    }
    onSave(serviceId, price);
    setEditingId(null);
    setTempPrice("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-50" />
      <div
        className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Editar Preços dos Serviços</h3>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{service.name}</h4>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
                {editingId === service.id ? (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="w-28 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => handleSave(service.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      aria-label={`Salvar preço de ${service.name}`}
                    >
                      <Check className="w-4 h-4" />
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setTempPrice("");
                      }}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-purple-600">R$ {service.price.toFixed(2)}</span>
                    <button
                      onClick={() => startEdit(service)}
                      className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                      aria-label={`Editar preço de ${service.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}