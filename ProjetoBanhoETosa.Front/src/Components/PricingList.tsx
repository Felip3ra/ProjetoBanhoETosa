import { Scissors,Dog } from "lucide-react";
export default function PricingList(){
    return(
        <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Tabela de Preços</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Banho e Tosa</span>
                  </div>
                  <span className="font-bold text-purple-600">R$ 80,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Dog className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Apenas Banho</span>
                  </div>
                  <span className="font-bold text-blue-600">R$ 50,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Apenas Tosa</span>
                  </div>
                  <span className="font-bold text-orange-600">R$ 60,00</span>
                </div>
              </div>
            </div>
    );
}