import { Dog, User, LogOut, Edit2, CreditCard, UserPlus, ListChecks } from "lucide-react";
import { useState } from "react";
import type { HeaderProps } from "../../interfaces/Header";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function Header({
  onEditPrices,
  onShowPlans,
  onShowClients,
  onShowSubscriptionsPage,
  userName = "Cliente",
  onLogout,
}: HeaderProps) {
  const [subscriptions] = useState([
    {
      id: 1,
      customerName: "Pedro Costa",
      planName: "Plano Básico",
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      price: 200,
      servicesUsed: 1,
      servicesAvailable: 4,
      paymentStatus: "pago",
    },
    {
      id: 2,
      customerName: "Ana Lima",
      planName: "Plano Premium",
      startDate: "2025-10-05",
      endDate: "2025-11-05",
      price: 350,
      servicesUsed: 3,
      servicesAvailable: 8,
      paymentStatus: "pendente",
    },
  ]);

  const expiringSubscriptions = subscriptions.filter((sub) => {
    const today = new Date();
    const endDate = new Date(sub.endDate);
    const daysUntilExpiration = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration >= 0 && sub.paymentStatus === "pendente";
  });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Dog className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Petshop</p>
            <h1 className="text-lg font-semibold text-slate-900">Banho e Tosa</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEditPrices}>
            <Edit2 className="h-4 w-4" />
            Preços
          </Button>
          <Button variant="outline" size="sm" onClick={onShowPlans}>
            <CreditCard className="h-4 w-4" />
            Planos
            {expiringSubscriptions.length > 0 && (
              <Badge variant="warning" className="ml-1">
                {expiringSubscriptions.length}
              </Badge>
            )}
          </Button>
          {onShowSubscriptionsPage && (
            <Button variant="outline" size="sm" onClick={onShowSubscriptionsPage}>
              <ListChecks className="h-4 w-4" />
              Assinaturas
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onShowClients}>
            <UserPlus className="h-4 w-4" />
            Clientes
          </Button>

          <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">{userName}</span>
          </div>

          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
