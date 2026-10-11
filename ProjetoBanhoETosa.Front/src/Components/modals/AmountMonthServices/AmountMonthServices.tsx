import type { AmountMonthServicesProps } from "../../../interfaces/Appointment";
import { countServicesByType } from "../../../utils/appointmentUtils";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function AmountMothServices({ MonthAppointments }: AmountMonthServicesProps) {
  const serviceCounts = countServicesByType(MonthAppointments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços do Mês</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3">
          <span className="text-slate-700">Banho e Tosa</span>
          <span className="text-xl font-semibold text-purple-600">{serviceCounts["Banho e Tosa"]}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
          <span className="text-slate-700">Apenas Banho</span>
          <span className="text-xl font-semibold text-blue-600">{serviceCounts["Banho"]}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
          <span className="text-slate-700">Apenas Tosa</span>
          <span className="text-xl font-semibold text-orange-600">{serviceCounts["Tosa"]}</span>
        </div>
      </CardContent>
    </Card>
  );
}
