interface Appointment {
  id: number;
  petName: string;
  owner: string;
  service: string;
  time: string;
  price: number;
  phone: string;
  date: string;
}
interface AmountMonthServicesProps{
    MonthAppointments: Appointment[]
}

export default function AmountMothServices({MonthAppointments} : AmountMonthServicesProps){
    return(
        <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Serviços do Mês</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Banho e Tosa</span>
                  <span className="font-bold text-purple-600 text-xl">
                    {MonthAppointments.filter(a => a.service === 'Banho e Tosa').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Apenas Banho</span>
                  <span className="font-bold text-blue-600 text-xl">
                    {MonthAppointments.filter(a => a.service === 'Banho').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Apenas Tosa</span>
                  <span className="font-bold text-orange-600 text-xl">
                    {MonthAppointments.filter(a => a.service === 'Tosa').length}
                  </span>
                </div>
              </div>
            </div>
    );
}