import { Scissors, Dog, Edit2 } from "lucide-react";
import type { PricingListProps } from "../../interfaces/PricingList";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PricingList({ services, OpenModalEdit }: PricingListProps) {
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("banho") && name.toLowerCase().includes("tosa")) {
      return <Scissors className="h-5 w-5 text-purple-600" />;
    }
    if (name.toLowerCase().includes("banho")) return <Dog className="h-5 w-5 text-blue-600" />;
    if (name.toLowerCase().includes("tosa")) return <Scissors className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const getColor = (name: string) => {
    if (name.toLowerCase().includes("banho") && name.toLowerCase().includes("tosa")) return "text-purple-600";
    if (name.toLowerCase().includes("banho")) return "text-blue-600";
    if (name.toLowerCase().includes("tosa")) return "text-orange-600";
    return "text-slate-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Tabela de Preços</CardTitle>
          <p className="text-sm text-slate-500">Valores atualizados por serviço</p>
        </div>
        <Button variant="ghost" size="icon" onClick={OpenModalEdit} aria-label="Editar preços">
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              {getIcon(service.name)}
              <span className="text-slate-700">{service.name}</span>
            </div>
            <span className={`text-base font-semibold ${getColor(service.name)}`}>
              R$ {service.price.toFixed(2)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
