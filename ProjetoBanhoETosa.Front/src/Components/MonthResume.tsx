

interface MonthResumeProps{
    AmountPets: number;
    Revenue: number;
}
export default function MonthResume({AmountPets,Revenue} : MonthResumeProps){
    return(
        
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Resumo do Mês</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Total de Pets</span>
                <span className="font-bold text-blue-600 text-xl">
                  {AmountPets}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Faturamento</span>
                <span className="font-bold text-green-600 text-xl">
                  R$ {Revenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
        
    );
}