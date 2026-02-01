import type { MonthResumeProps } from "../../interfaces/MonthResume";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function MonthResume({ AmountPets, Revenue }: MonthResumeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Mês</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-500">Total de Pets</span>
          <span className="text-lg font-semibold text-slate-900">{AmountPets}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
          <span className="text-sm text-slate-200">Faturamento</span>
          <span className="text-lg font-semibold">R$ {Revenue.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
