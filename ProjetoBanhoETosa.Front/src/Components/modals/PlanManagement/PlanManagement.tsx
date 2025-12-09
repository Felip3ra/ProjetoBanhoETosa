import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { PlanManagement } from "../../../interfaces/PlanManagement";
import { planService, type Plan } from "../../../services/planService";
import styles from "./PlanManagement.module.css";
import SubscriptionItem from "../../SubscriptionItem/SubscriptionItem";

export default function PlanManagement({
  subscriptions,
  clients,
  onClose,
  onConfirmPayment,
  onCreateSubscription,
  creatingSubscription,
  confirmingPayment,
}: PlanManagement) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const [savingPlan, setSavingPlan] = useState<boolean>(false);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);
  const [planFormError, setPlanFormError] = useState<string | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState<boolean>(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [newPlan, setNewPlan] = useState<Plan>({
    name: "",
    description: "",
    price: 0,
    servicesAvailable: 0,
  });
  const [subscriptionForm, setSubscriptionForm] = useState({
    clientId: "",
    planId: "",
    startDate: "",
    paymentMethod: "PIX",
    paymentStatus: "pendente",
  });
  const [subscriptionFormError, setSubscriptionFormError] = useState<string | null>(null);

  const formatDate = (value: Date | string) => {
    const date = typeof value === "string" ? new Date(value) : value;
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR");
  };

  const calculateEndDate = (startDate: string) => {
    if (!startDate) return null;
    const end = new Date(startDate);
    end.setDate(end.getDate() + 30);
    return end;
  };

  const selectedPlan = useMemo(
    () => plans.find((p) => (p.id ?? "").toString() === subscriptionForm.planId),
    [plans, subscriptionForm.planId]
  );

  const nextPaymentPreview = useMemo(() => {
    const end = calculateEndDate(subscriptionForm.startDate);
    return end ? formatDate(end) : "";
  }, [subscriptionForm.startDate]);

  const loadPlans = async () => {
    setLoadingPlans(true);
    setErrorPlans(null);
    try {
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (error: any) {
      console.error("Erro ao carregar planos", error);
      setErrorPlans(error?.message ?? "Erro ao carregar planos");
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlanFormError(null);
    if (!newPlan.name || newPlan.price <= 0 || newPlan.servicesAvailable <= 0) {
      setPlanFormError("Preencha nome, preco (> 0) e servicos disponiveis (> 0)");
      return;
    }

    setSavingPlan(true);
    try {
      const created = await planService.createPlan(newPlan);
      setPlans((prev) => [...prev, created]);
      setNewPlan({ name: "", description: "", price: 0, servicesAvailable: 0 });
      setShowNewPlanForm(false);
    } catch (error: any) {
      console.error("Erro ao criar plano", error);
      setPlanFormError(error?.message ?? "Erro ao criar plano");
    } finally {
      setSavingPlan(false);
    }
  };

  const handleStartEditPlan = (plan: Plan) => {
    setEditingPlanId(plan.id ?? null);
    setEditingPlan({ ...plan });
    setPlanFormError(null);
    setShowNewPlanForm(false);
  };

  const handleUpdatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlanId || !editingPlan) return;
    if (!editingPlan.name || editingPlan.price <= 0 || editingPlan.servicesAvailable <= 0) {
      setPlanFormError("Preencha nome, preco (> 0) e servicos disponiveis (> 0)");
      return;
    }

    setSavingPlan(true);
    setPlanFormError(null);
    try {
      const payload = {
        name: editingPlan.name,
        description: editingPlan.description,
        price: editingPlan.price,
        servicesAvailable: editingPlan.servicesAvailable,
      };
      const updated = await planService.updatePlan(editingPlanId, payload);
      setPlans((prev) => prev.map((p) => (p.id === editingPlanId ? { ...p, ...payload, ...updated } : p)));
      setEditingPlanId(null);
      setEditingPlan(null);
    } catch (error: any) {
      console.error("Erro ao atualizar plano", error);
      setPlanFormError(error?.message ?? "Erro ao atualizar plano");
    } finally {
      setSavingPlan(false);
    }
  };

  const handleCancelEditPlan = () => {
    setEditingPlanId(null);
    setEditingPlan(null);
    setPlanFormError(null);
  };

  const handleCreateSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscriptionFormError(null);

    const client = clients.find((c) => (c.id ?? "").toString() === subscriptionForm.clientId);
    const plan = selectedPlan;

    if (!client || !plan || !subscriptionForm.startDate) {
      setSubscriptionFormError("Selecione cliente, plano e data de inicio.");
      return;
    }

    const endDate = calculateEndDate(subscriptionForm.startDate);
    if (!endDate) {
      setSubscriptionFormError("Data de inicio invalida.");
      return;
    }

    const success = await onCreateSubscription({
      customerName: client.name,
      phone: client.phone,
      email: client.email,
      planName: plan.name,
      startDate: new Date(subscriptionForm.startDate).toISOString(),
      endDate: endDate.toISOString(),
      price: plan.price,
      servicesUsed: 0,
      servicesAvailable: plan.servicesAvailable,
      paymentStatus: subscriptionForm.paymentStatus,
      paymentMethod: subscriptionForm.paymentMethod,
    });

    if (!success) {
      setSubscriptionFormError("Nao foi possivel salvar a assinatura. Tente novamente.");
      return;
    }

    setSubscriptionForm({
      clientId: "",
      planId: "",
      startDate: "",
      paymentMethod: "PIX",
      paymentStatus: "pendente",
    });
  };

  const handleDeletePlan = async (planId?: number) => {
    if (!planId) return;
    const confirm = window.confirm("Deseja excluir este plano?");
    if (!confirm) return;

    setSavingPlan(true);
    try {
      await planService.deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
      if (editingPlanId === planId) {
        handleCancelEditPlan();
      }
    } catch (error: any) {
      console.error("Erro ao deletar plano", error);
      alert(error?.message ?? "Erro ao deletar plano");
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div className={styles.Container} onClick={onClose}>
      <div className={styles["Container-Background"]} />
      <div
        className={styles["Container-Modal-Plan"]}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles["Container-Header-Modal-Plan"]}>
          <h3 className={styles["Container-Header-Modal-Plan-Tittle"]}>Gerenciar Planos Mensais</h3>
          <button
            className={styles["Button-New-Plan"]}
            onClick={() => {
              setShowNewPlanForm((prev) => !prev);
              setEditingPlanId(null);
              setEditingPlan(null);
              setPlanFormError(null);
            }}
          >
            <Plus className={styles["Icon-Plus"]} />
            {showNewPlanForm ? "Fechar" : "Novo Plano"}
          </button>
        </div>

        {showNewPlanForm && (
          <form className={`${styles.FormPanel} mb-4`} onSubmit={handleCreatePlan}>
            <p className={styles.FormTitle}>Novo plano</p>

            <div className={styles.FormGrid}>
              <label className={styles.Field}>
                <span className={styles.Label}>Nome</span>
                <input
                  className={styles.Input}
                  placeholder="Ex.: Plano Premium"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>

              <label className={styles.Field}>
                <span className={styles.Label}>Descricao</span>
                <input
                  className={styles.Input}
                  placeholder="Destaque os beneficios"
                  value={newPlan.description ?? ""}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, description: e.target.value }))}
                />
              </label>

              <label className={styles.Field}>
                <span className={styles.Label}>Preco (R$)</span>
                <input
                  className={styles.Input}
                  placeholder="Ex.: 129.90"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
                <span className={styles.Hint}>Use ponto para decimais.</span>
              </label>

              <label className={styles.Field}>
                <span className={styles.Label}>Servicos disponiveis</span>
                <input
                  className={styles.Input}
                  placeholder="Ex.: 6"
                  type="number"
                  min="1"
                  value={newPlan.servicesAvailable}
                  onChange={(e) =>
                    setNewPlan((prev) => ({ ...prev, servicesAvailable: parseInt(e.target.value, 10) || 0 }))
                  }
                />
                <span className={styles.Hint}>Quantidade de utilizacoes incluidas no mes.</span>
              </label>
            </div>

            {planFormError && <p className="text-sm text-red-600">{planFormError}</p>}

            <button type="submit" className={styles.PrimaryButton} disabled={savingPlan}>
              {savingPlan ? "Salvando..." : "Salvar plano"}
            </button>
          </form>
        )}

        {editingPlanId && editingPlan && (
          <form className={`${styles.FormPanel} mb-4`} onSubmit={handleUpdatePlan}>
            <p className={styles.FormTitle}>Editar plano</p>

            <div className={styles.FormGrid}>
              <label className={styles.Field}>
                <span className={styles.Label}>Nome</span>
                <input
                  className={styles.Input}
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                />
              </label>

              <label className={styles.Field}>
                <span className={styles.Label}>Descricao</span>
                <input
                  className={styles.Input}
                  value={editingPlan.description ?? ""}
                  onChange={(e) =>
                    setEditingPlan((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                  }
                />
              </label>

              <label className={styles.Field}>
                <span className={styles.Label}>Preco (R$)</span>
                <input
                  className={styles.Input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingPlan.price}
                  onChange={(e) =>
                    setEditingPlan((prev) =>
                      prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : prev
                    )
                  }
                />
                <span className={styles.Hint}>Use ponto para decimais.</span>
              </label>

              <label className={styles.Field}>
                <span className={styles.Label}>Servicos disponiveis</span>
                <input
                  className={styles.Input}
                  type="number"
                  min="1"
                  value={editingPlan.servicesAvailable}
                  onChange={(e) =>
                    setEditingPlan((prev) =>
                      prev ? { ...prev, servicesAvailable: parseInt(e.target.value, 10) || 0 } : prev
                    )
                  }
                />
                <span className={styles.Hint}>Quantidade de utilizacoes incluidas no mes.</span>
              </label>
            </div>

            {planFormError && <p className="text-sm text-red-600">{planFormError}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelEditPlan}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button type="submit" className={styles.PrimaryButton} disabled={savingPlan}>
                {savingPlan ? "Salvando..." : "Salvar alteracoes"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3 mb-4">
          <h4 className={styles.ListHeader}>Planos</h4>
          {loadingPlans && <p>Carregando planos...</p>}
          {errorPlans && <p className="text-red-600">{errorPlans}</p>}
          {!loadingPlans && !errorPlans && plans.length === 0 && <p>Nenhum plano cadastrado.</p>}
          {!loadingPlans &&
            plans.map((plan) => (
              <div key={plan.id} className={styles.Card}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{plan.name}</p>
                    {plan.description && <p className="text-sm text-gray-600">{plan.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">R$ {plan.price?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{plan.servicesAvailable} servicos</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50"
                    onClick={() => handleStartEditPlan(plan)}
                    disabled={savingPlan}
                  >
                    Editar
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700 disabled:opacity-50"
                    onClick={() => handleDeletePlan(plan.id)}
                    disabled={savingPlan}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </div>

        <form className={`${styles.FormPanel} mb-4`} onSubmit={handleCreateSubscription}>
          <p className={styles.FormTitle}>Vincular cliente a plano</p>

          <div className={styles.FormGrid}>
            <label className={styles.Field}>
              <span className={styles.Label}>Cliente</span>
              <select
                className={styles.Input}
                value={subscriptionForm.clientId}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, clientId: e.target.value }))}
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id?.toString() ?? ""}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.Field}>
              <span className={styles.Label}>Plano mensal</span>
              <select
                className={styles.Input}
                value={subscriptionForm.planId}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, planId: e.target.value }))}
              >
                <option value="">Selecione um plano</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id?.toString() ?? ""}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.Field}>
              <span className={styles.Label}>Data de inicio</span>
              <input
                className={styles.Input}
                type="date"
                value={subscriptionForm.startDate}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, startDate: e.target.value }))}
              />
              <span className={styles.Hint}>Prevemos 30 dias de validade a partir desta data.</span>
            </label>

            <label className={styles.Field}>
              <span className={styles.Label}>Forma de pagamento</span>
              <select
                className={styles.Input}
                value={subscriptionForm.paymentMethod}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
              >
                <option value="PIX">PIX</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartao Debito">Cartao Debito</option>
                <option value="Cartao Credito">Cartao Credito</option>
              </select>
            </label>

            <label className={styles.Field}>
              <span className={styles.Label}>Status do pagamento</span>
              <select
                className={styles.Input}
                value={subscriptionForm.paymentStatus}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </label>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-2 space-y-2">
            <p className="text-sm font-semibold text-purple-800">Resumo do plano escolhido</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-600 block">Plano</span>
                <span className="font-semibold">{selectedPlan?.name ?? "Selecione um plano"}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Servicos incluidos</span>
                <span className="font-semibold">{selectedPlan?.servicesAvailable ?? 0} por mes</span>
              </div>
              <div>
                <span className="text-gray-600 block">Valor mensal</span>
                <span className="font-semibold text-purple-700">
                  R$ {(selectedPlan?.price ?? 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Proximo pagamento</span>
                <span className="font-semibold">{nextPaymentPreview || "Selecione a data de inicio"}</span>
              </div>
            </div>
          </div>

          {subscriptionFormError && <p className="text-sm text-red-600">{subscriptionFormError}</p>}

          <button type="submit" className={styles.PrimaryButton} disabled={Boolean(creatingSubscription)}>
            {creatingSubscription ? "Salvando assinatura..." : "Salvar assinatura"}
          </button>
        </form>

        <div className="space-y-4">
          <h4 className={styles.ListHeader}>Assinaturas ativas</h4>
          {subscriptions.length === 0 && <p className="text-sm text-gray-600">Nenhum cliente vinculado a planos.</p>}
          {subscriptions.map((sub) => (
            <SubscriptionItem
              key={sub.id}
              subscription={sub}
              onConfirmPayment={onConfirmPayment}
              confirmingPayment={Boolean(confirmingPayment)}
            />
          ))}

          <button onClick={onClose} className={styles["Button-Close"]}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
