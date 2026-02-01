import { AlertCircle } from "lucide-react";
import type { Subscription } from "../../services/subscriptionService";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface SubscriptionItemProps {
  subscription: Subscription;
  onConfirmPayment: (subscription: Subscription) => void;
  confirmingPayment?: boolean;
}

export default function SubscriptionItem({ subscription, onConfirmPayment, confirmingPayment }: SubscriptionItemProps) {
  const nextPaymentDate = new Date(subscription.endDate);
  const daysLeft = Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  const toneClass = isExpired
    ? "border-red-200 bg-red-50"
    : isExpiring
    ? "border-amber-200 bg-amber-50"
    : "border-emerald-200 bg-emerald-50";

  return (
    <div key={subscription.id} className={cn("rounded-xl border p-4", toneClass)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">{subscription.customerName}</h4>
          <p className="text-sm text-slate-600">{subscription.planName}</p>
        </div>
        <Badge variant={subscription.paymentStatus === "pago" ? "success" : "warning"}>
          {subscription.paymentStatus.toUpperCase()}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
        <div>
          <span className="text-slate-500">Início:</span>
          <span className="ml-1 font-semibold">
            {new Date(subscription.startDate).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Término:</span>
          <span className="ml-1 font-semibold">
            {new Date(subscription.endDate).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Serviços:</span>
          <span className="ml-1 font-semibold">
            {subscription.servicesUsed}/{subscription.servicesAvailable}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Valor:</span>
          <span className="ml-1 font-semibold text-emerald-600">R$ {subscription.price.toFixed(2)}</span>
        </div>
        <div className="col-span-2 md:col-span-2">
          <span className="text-slate-500">Próximo pagamento:</span>
          <span className="ml-1 font-semibold">
            {nextPaymentDate.toLocaleDateString("pt-BR")}{" "}
            {daysLeft >= 0 ? `(em ${daysLeft} dia${daysLeft === 1 ? "" : "s"})` : ""}
          </span>
        </div>
      </div>

      {isExpiring && subscription.paymentStatus === "pendente" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4" />
          <span>Expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}</span>
        </div>
      )}

      {isExpired && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>Vencido há {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? "dia" : "dias"}</span>
        </div>
      )}

      {subscription.paymentStatus === "pendente" && (
        <Button
          type="button"
          variant="brand"
          className="mt-4 w-full"
          onClick={() => onConfirmPayment(subscription)}
          disabled={confirmingPayment}
        >
          {confirmingPayment ? "Confirmando..." : "Confirmar Pagamento"}
        </Button>
      )}
    </div>
  );
}
