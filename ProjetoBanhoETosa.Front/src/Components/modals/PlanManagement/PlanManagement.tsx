import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PlanManagement } from "../../../interfaces/PlanManagement";
import { planService, type Plan } from "../../../services/planService";
import { petService, type Pet } from "../../../services/petService";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useToast } from "../../common/ToastProvider";

const selectClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function PlanManagement({
  subscriptions,
  clients,
  onClose,
  onCreateSubscription,
  creatingSubscription,
}: PlanManagement) {
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);
  const [planFormError, setPlanFormError] = useState<string | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
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
  const [activeTab, setActiveTab] = useState<"plans" | "subscriptions">("plans");
  const [clientPets, setClientPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petError, setPetError] = useState<string | null>(null);
  const [selectedPetName, setSelectedPetName] = useState("");
  const [subscriptionFormError, setSubscriptionFormError] = useState<string | null>(null);
  const planCount = plans.length;
  const subscriptionCount = subscriptions.length;

  const formatDate = (value: Date | string) => {
    const date = typeof value === "string" ? new Date(value) : value;
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR");
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

  const petOptions = useMemo(() => {
    const names = clientPets.map((pet) => pet.name).filter((name) => name?.trim());
    return Array.from(new Set(names));
  }, [clientPets]);

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

  useEffect(() => {
    if (!subscriptionForm.clientId) {
      setClientPets([]);
      setSelectedPetName("");
      setPetError(null);
      setLoadingPets(false);
      return;
    }

    const clientId = Number(subscriptionForm.clientId);
    if (!clientId) {
      setClientPets([]);
      setSelectedPetName("");
      setPetError(null);
      setLoadingPets(false);
      return;
    }

    let active = true;
    setLoadingPets(true);
    setPetError(null);
    petService
      .getByClient(clientId)
      .then((data) => {
        if (!active) return;
        setClientPets(data);
      })
      .catch((error: any) => {
        if (!active) return;
        setClientPets([]);
        setPetError(error?.message ?? "Erro ao carregar pets do cliente.");
      })
      .finally(() => {
        if (!active) return;
        setLoadingPets(false);
      });

    return () => {
      active = false;
    };
  }, [subscriptionForm.clientId]);

  useEffect(() => {
    if (petOptions.length === 0) {
      if (selectedPetName) setSelectedPetName("");
      return;
    }

    if (!petOptions.includes(selectedPetName)) {
      setSelectedPetName(petOptions[0]);
    }
  }, [petOptions, selectedPetName]);

  const handleCreatePlan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlanFormError(null);
    if (!newPlan.name || newPlan.price <= 0 || newPlan.servicesAvailable <= 0) {
      setPlanFormError("Preencha nome, preço (> 0) e serviços disponíveis (> 0)");
      return;
    }

    setSavingPlan(true);
    try {
      const created = await planService.createPlan(newPlan);
      setPlans((prev) => [...prev, created]);
      setNewPlan({ name: "", description: "", price: 0, servicesAvailable: 0 });
      setShowNewPlanForm(false);
      pushToast({ message: "Plano criado com sucesso.", variant: "success" });
    } catch (error: any) {
      console.error("Erro ao criar plano", error);
      setPlanFormError(error?.message ?? "Erro ao criar plano");
      pushToast({ message: error?.message ?? "Erro ao criar plano.", variant: "error" });
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

  const handleUpdatePlan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlanId || !editingPlan) return;
    if (!editingPlan.name || editingPlan.price <= 0 || editingPlan.servicesAvailable <= 0) {
      setPlanFormError("Preencha nome, preço (> 0) e serviços disponíveis (> 0)");
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
      pushToast({ message: "Plano atualizado com sucesso.", variant: "success" });
    } catch (error: any) {
      console.error("Erro ao atualizar plano", error);
      setPlanFormError(error?.message ?? "Erro ao atualizar plano");
      pushToast({ message: error?.message ?? "Erro ao atualizar plano.", variant: "error" });
    } finally {
      setSavingPlan(false);
    }
  };

  const handleCancelEditPlan = () => {
    setEditingPlanId(null);
    setEditingPlan(null);
    setPlanFormError(null);
  };

  const handleTabChange = (tab: "plans" | "subscriptions") => {
    setActiveTab(tab);
    if (tab === "subscriptions") {
      setShowNewPlanForm(false);
      setEditingPlanId(null);
      setEditingPlan(null);
      setPlanFormError(null);
    } else {
      setSubscriptionFormError(null);
    }
  };

  const handleCreateSubscription = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscriptionFormError(null);

    const client = clients.find((c) => (c.id ?? "").toString() === subscriptionForm.clientId);
    const plan = selectedPlan;

    if (!client || !plan || !subscriptionForm.startDate) {
      setSubscriptionFormError("Selecione cliente, plano e data de início.");
      return;
    }

    const endDate = calculateEndDate(subscriptionForm.startDate);
    if (!endDate) {
      setSubscriptionFormError("Data de início inválida.");
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
      setSubscriptionFormError("Não foi possível salvar a assinatura. Tente novamente.");
      pushToast({ message: "Não foi possível salvar a assinatura.", variant: "error" });
      return;
    }

    setSubscriptionForm({
      clientId: "",
      planId: "",
      startDate: "",
      paymentMethod: "PIX",
      paymentStatus: "pendente",
    });
    pushToast({ message: "Assinatura criada com sucesso.", variant: "success" });
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
      pushToast({ message: "Plano removido com sucesso.", variant: "success" });
    } catch (error: any) {
      console.error("Erro ao deletar plano", error);
      pushToast({ message: error?.message ?? "Erro ao deletar plano.", variant: "error" });
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Card className="border-slate-200/80 shadow-2xl">
          <CardHeader className="space-y-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Gerenciar Planos Mensais</CardTitle>
                <p className="text-sm text-slate-500">Crie planos, vincule clientes e confirme pagamentos.</p>
              </div>
              {activeTab === "plans" && (
                <Button
                  type="button"
                  variant={showNewPlanForm ? "outline" : "brand"}
                  onClick={() => {
                    setShowNewPlanForm((prev) => !prev);
                    setEditingPlanId(null);
                    setEditingPlan(null);
                    setPlanFormError(null);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {showNewPlanForm ? "Fechar" : "Novo Plano"}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={activeTab === "plans" ? "brand" : "outline"}
                onClick={() => handleTabChange("plans")}
              >
                Planos
                <Badge variant={activeTab === "plans" ? "default" : "secondary"} className="ml-1">
                  {planCount}
                </Badge>
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === "subscriptions" ? "brand" : "outline"}
                onClick={() => handleTabChange("subscriptions")}
              >
                Assinaturas
                <Badge variant={activeTab === "subscriptions" ? "default" : "secondary"} className="ml-1">
                  {subscriptionCount}
                </Badge>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === "plans" && (
              <>
            {showNewPlanForm && (
              <form className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4" onSubmit={handleCreatePlan}>
                <p className="text-sm font-semibold text-slate-900">Novo plano</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      placeholder="Ex.: Plano Premium"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Destaque os benefícios"
                      value={newPlan.description ?? ""}
                      onChange={(e) => setNewPlan((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input
                      placeholder="Ex.: 129.90"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                    <p className="text-xs text-slate-500">Use ponto para decimais.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Serviços disponíveis</Label>
                    <Input
                      placeholder="Ex.: 6"
                      type="number"
                      min="1"
                      value={newPlan.servicesAvailable}
                      onChange={(e) =>
                        setNewPlan((prev) => ({ ...prev, servicesAvailable: parseInt(e.target.value, 10) || 0 }))
                      }
                    />
                    <p className="text-xs text-slate-500">Quantidade de utilizações incluídas no mês.</p>
                  </div>
                </div>

                {planFormError && <p className="text-sm text-red-600">{planFormError}</p>}

                <Button type="submit" variant="brand" disabled={savingPlan}>
                  {savingPlan ? "Salvando..." : "Salvar plano"}
                </Button>
              </form>
            )}

            {editingPlanId && editingPlan && (
              <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-4" onSubmit={handleUpdatePlan}>
                <p className="text-sm font-semibold text-slate-900">Editar plano</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={editingPlan.description ?? ""}
                      onChange={(e) =>
                        setEditingPlan((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingPlan.price}
                      onChange={(e) =>
                        setEditingPlan((prev) => (prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : prev))
                      }
                    />
                    <p className="text-xs text-slate-500">Use ponto para decimais.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Serviços disponíveis</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editingPlan.servicesAvailable}
                      onChange={(e) =>
                        setEditingPlan((prev) =>
                          prev ? { ...prev, servicesAvailable: parseInt(e.target.value, 10) || 0 } : prev
                        )
                      }
                    />
                    <p className="text-xs text-slate-500">Quantidade de utilizações incluídas no mês.</p>
                  </div>
                </div>

                {planFormError && <p className="text-sm text-red-600">{planFormError}</p>}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="button" variant="outline" onClick={handleCancelEditPlan} className="w-full">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="brand" disabled={savingPlan} className="w-full">
                    {savingPlan ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Planos</h4>
              {loadingPlans && <p className="text-sm text-slate-500">Carregando planos...</p>}
              {errorPlans && <p className="text-sm text-red-600">{errorPlans}</p>}
              {!loadingPlans && !errorPlans && plans.length === 0 && (
                <p className="text-sm text-slate-500">Nenhum plano cadastrado.</p>
              )}
              {!loadingPlans &&
                plans.map((plan) => (
                  <div key={plan.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{plan.name}</p>
                        {plan.description && <p className="text-sm text-slate-500">{plan.description}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="font-medium text-slate-900">R$ {plan.price?.toFixed(2)}</p>
                          <p className="text-sm text-slate-500">{plan.servicesAvailable} serviços</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEditPlan(plan)}
                            disabled={savingPlan}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={savingPlan}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
              </>
            )}

            {activeTab === "subscriptions" && (
              <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <form className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4" onSubmit={handleCreateSubscription}>
              <p className="text-sm font-semibold text-slate-900">Vincular cliente a plano</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <select
                    className={selectClass}
                    value={subscriptionForm.clientId}
                    onChange={(e) => {
                      const nextClientId = e.target.value;
                      setSubscriptionForm((prev) => ({ ...prev, clientId: nextClientId }));
                      setSelectedPetName("");
                    }}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id?.toString() ?? ""}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Pet</Label>
                  <select
                    className={selectClass}
                    value={selectedPetName}
                    onChange={(e) => setSelectedPetName(e.target.value)}
                    disabled={!subscriptionForm.clientId || loadingPets || petOptions.length === 0}
                  >
                    {!subscriptionForm.clientId && <option value="">Selecione um cliente</option>}
                    {loadingPets && <option value="">Carregando pets...</option>}
                    {!loadingPets && subscriptionForm.clientId && petOptions.length === 0 && (
                      <option value="">Nenhum pet cadastrado</option>
                    )}
                    {!loadingPets &&
                      petOptions.map((pet) => (
                        <option key={pet} value={pet}>
                          {pet}
                        </option>
                      ))}
                  </select>
                  {petError && <p className="text-xs text-amber-600">{petError}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Plano mensal</Label>
                  <select
                    className={selectClass}
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
                </div>

                <div className="space-y-2">
                  <Label>Data de início</Label>
                  <Input
                    type="date"
                    value={subscriptionForm.startDate}
                    onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                  <p className="text-xs text-slate-500">Prevemos 30 dias de validade a partir desta data.</p>
                </div>

                <div className="space-y-2">
                  <Label>Forma de pagamento</Label>
                  <select
                    className={selectClass}
                    value={subscriptionForm.paymentMethod}
                    onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartao Debito">Cartão Débito</option>
                    <option value="Cartao Credito">Cartão Crédito</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status do pagamento</Label>
                  <select
                    className={selectClass}
                    value={subscriptionForm.paymentStatus}
                    onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">Resumo do plano escolhido</p>
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                  <div>
                    <span className="text-slate-500 block">Plano</span>
                    <span className="font-semibold">{selectedPlan?.name ?? "Selecione um plano"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Serviços incluídos</span>
                    <span className="font-semibold">{selectedPlan?.servicesAvailable ?? 0} por mês</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Valor mensal</span>
                    <span className="font-semibold text-slate-900">
                      R$ {(selectedPlan?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Próximo pagamento</span>
                    <span className="font-semibold">{nextPaymentPreview || "Selecione a data de início"}</span>
                  </div>
                </div>
              </div>

              {subscriptionFormError && <p className="text-sm text-red-600">{subscriptionFormError}</p>}

              <Button type="submit" variant="brand" disabled={Boolean(creatingSubscription)}>
                {creatingSubscription ? "Salvando assinatura..." : "Salvar assinatura"}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Assinaturas</h4>
                    <p className="text-xs text-slate-500">A lista completa agora fica em uma página dedicada.</p>
                  </div>
                  <Badge variant="secondary">{subscriptionCount}</Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    onClose();
                    navigate("/Assinaturas");
                  }}
                >
                  Ver lista de assinaturas
                </Button>
              </div>
            </div>
              </div>
            )}

            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Fechar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
