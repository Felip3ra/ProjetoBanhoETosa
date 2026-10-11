import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Badge } from "../../Components/ui/badge";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { useToast } from "../../Components/common/ToastProvider";
import SubscriptionItem from "../../Components/SubscriptionItem/SubscriptionItem";
import type { Subscription } from "../../services/subscriptionService";

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const {
    subscriptions,
    loading,
    error,
    confirmSubscriptionPayment,
    isConfirmingPayment,
  } = useSubscriptions();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredSubscriptions = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return subscriptions;

    return subscriptions.filter((sub) => {
      const haystack = [
        sub.customerName,
        sub.planName,
        sub.phone,
        sub.email ?? "",
        sub.paymentStatus,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [subscriptions, search]);

  const totalPages = Math.max(1, Math.ceil(filteredSubscriptions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredSubscriptions.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(filteredSubscriptions.length, safePage * pageSize);
  const pagedSubscriptions = filteredSubscriptions.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleConfirmPayment = async (subscription: Subscription) => {
    const success = await confirmSubscriptionPayment(subscription);
    if (success) {
      pushToast({ message: "Pagamento confirmado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível confirmar o pagamento.", variant: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Petshop</p>
            <h1 className="text-lg font-semibold text-slate-900">Assinaturas</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/Home")}>Voltar</Button>
            <Badge variant="secondary">{subscriptions.length} total</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-6 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Assinaturas cadastradas</p>
            <p className="text-xs text-slate-500">Mostrando {startIndex}-{endIndex} de {filteredSubscriptions.length}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, plano, telefone, email ou status"
              className="sm:w-80"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage <= 1}
              >
                Anterior
              </Button>
              <span className="text-xs text-slate-500">Página {safePage} de {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage >= totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-slate-500">Carregando assinaturas...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && pagedSubscriptions.length === 0 && (
          <p className="text-sm text-slate-500">Nenhuma assinatura encontrada.</p>
        )}

        <div className="space-y-4">
          {pagedSubscriptions.map((sub) => (
            <SubscriptionItem
              key={sub.id}
              subscription={sub}
              onConfirmPayment={handleConfirmPayment}
              confirmingPayment={isConfirmingPayment}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
