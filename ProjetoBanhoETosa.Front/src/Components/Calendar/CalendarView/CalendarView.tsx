import { useState, useEffect } from "react";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import AppointmentList from "../../AppointmentList/AppointmentList";
import AddAppointmentModal from "../../modals/AddAppointmentModal/AddAppointmentModal";
import EditingPriceServices from "../../modals/EditingPriceServices/EditingPriceServices";
import PlanManagement from "../../modals/PlanManagement/PlanManagement";
import MonthResume from "../../MonthResume/MonthResume";
import PricingList from "../../PricingList/PricingList";
import AmountMothServices from "../../modals/AmountMonthServices/AmountMonthServices";
import Header from "../../Header/Header";
import { useAppointments } from "../../../hooks/useAppointments";
import { useServices } from "../../../hooks/useServices";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useCalendar } from "../../../hooks/useCalendar";
import { useNewAppointmentForm } from "../../../hooks/useNewAppointmentForm";
import LoadingSpinner from "../../common/LoadingSpinner"; // Import the new LoadingSpinner component
import { useToast } from "../../common/ToastProvider";
import { useClients } from "../../../hooks/useClients";
import ClientSummary from "../../ClientSummary/ClientSummary";
import type { Client } from "../../../services/clientService";
import { useNavigate } from "react-router-dom";

type CalendarViewProps = {
  userName?: string;
  onLogout?: () => void;
};

type Subscription = {
  id: number;
  customerName: string;
  planName: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  servicesUsed: number;
  servicesAvailable: number;
  price: number;
};

export default function CalendarView({ userName, onLogout }: CalendarViewProps) {
  const [ShowEditPricesModal, setShowEditPricesModal] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [autoPlanApplied, setAutoPlanApplied] = useState(false);
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);

  const { appointments: appointmentsFromHook, addAppointment, deleteAppointment, refetchAppointments, loading: loadingAppointments, isAdding, isDeleting, error: errorAppointments } = useAppointments();
  const appointments = appointmentsFromHook || []; // Defensive check
  const { services: servicesFromHook, updateServicePrice, addService, deleteService, refetchServices, loading: loadingServices, isUpdating, error: errorServices } = useServices();
  const services = servicesFromHook || []; // Defensive check
  const {
    subscriptions: subscriptionsFromHook,
    confirmSubscriptionPayment,
    createSubscription,
    refetchSubscriptions,
    loading: loadingSubscriptions,
    isConfirmingPayment,
    isCreating,
    error: errorSubscriptions
  } = useSubscriptions();
  const subscriptions = subscriptionsFromHook || []; // Defensive check
  const { currentDate, selectedDate, changeMonth, generateMonthDays, setSelectedDate } = useCalendar();
  const { newAppointment, setNewAppointment, handleServiceChange, resetForm } = useNewAppointmentForm(services, selectedDate);
  const { summary: clientSummary, clients, loading: loadingClients, error: errorClients, refetchSummary, refetchClients } = useClients();

  useEffect(() => {
    // Refetch all data when component mounts or a relevant action occurs
    const fetchData = async () => {
      await Promise.all([refetchAppointments(), refetchServices(), refetchSubscriptions(), refetchSummary(), refetchClients()]);
    };
    fetchData();
  }, [refetchAppointments, refetchServices, refetchSubscriptions, refetchSummary, refetchClients]);

  // Atualizar preço de serviço
  const handleUpdateServicePrice = async (serviceId: number, newPrice: number) => {
    const success = await updateServicePrice(serviceId, newPrice);
    if (success) {
      pushToast({ message: "Preço atualizado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível atualizar o preço.", variant: "error" });
    }
  };

  const handleCreateService = async (service: { name: string; price: number; durationInMinutes: number }) => {
    const success = await addService(service);
    if (success) {
      pushToast({ message: "Serviço cadastrado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível cadastrar o serviço.", variant: "error" });
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    const success = await deleteService(serviceId);
    if (success) {
      pushToast({ message: "Serviço removido com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível remover o serviço.", variant: "error" });
    }
  };

  // Adicionar agendamento
  const handleAddAppointment = async () => {
    if (
      !newAppointment.petName ||
      !newAppointment.owner ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      pushToast({ message: "Preencha todos os campos obrigatórios.", variant: "error" });
      return;
    }

    if (newAppointment.paymentMethod === "Plano Mensal" || newAppointment.subscriptionId) {
      const activeSub =
        subscriptions.find((sub) => sub.id === newAppointment.subscriptionId) ||
        findActiveSubscriptionForClient(newAppointment.owner);

      if (!activeSub) {
        pushToast({ message: "Assinatura ativa não encontrada ou sem serviços disponíveis.", variant: "error" });
        return;
      }

      if (activeSub.servicesUsed >= activeSub.servicesAvailable) {
        pushToast({ message: "Limite de serviços do plano atingido.", variant: "error" });
        return;
      }
    }

    const success = await addAppointment({ ...newAppointment, date: selectedDate });
    if (success) {
      setShowAddModal(false);
      resetForm(); // Use resetForm from the hook
      setAutoPlanApplied(false);
      await refetchSubscriptions();
      pushToast({ message: "Agendamento criado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível criar o agendamento.", variant: "error" });
    }
  };

  // Excluir agendamento
  const handleDeleteAppointment = async (id: number) => {
    const success = await deleteAppointment(id);
    if (success) {
      pushToast({ message: "Agendamento excluído.", variant: "success" });
    }
  };

  // Confirmar pagamento de assinatura
  const handleConfirmSubscriptionPayment = async (subscription: Subscription) => {
    const success = await confirmSubscriptionPayment(subscription);
    if (success) {
      pushToast({ message: "Pagamento confirmado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível confirmar o pagamento.", variant: "error" });
    }
  };

  const handleChangeServiceKeepingPlan = (serviceName: string) => {
    handleServiceChange(serviceName);
    setNewAppointment((prev) => {
      if (prev.paymentMethod === "Plano Mensal") {
        return { ...prev, service: serviceName, price: 0 };
      }
      return prev;
    });
  };

  const findActiveSubscriptionForClient = (clientName: string): Subscription | undefined => {
    const today = new Date();
    return subscriptions.find((sub) => {
      const end = new Date(sub.endDate);
      return (
        sub.customerName?.toLowerCase() === clientName.toLowerCase() &&
        sub.paymentStatus === "pago" &&
        end.getTime() >= today.getTime() &&
        sub.servicesUsed < sub.servicesAvailable
      );
    });
  };

  const getServicePrice = (serviceName: string) => {
    const srv = services.find((s) => s.name === serviceName);
    return srv ? srv.price : newAppointment.price;
  };

  const handleSelectClient = (clientId?: number) => {
    setAutoPlanApplied(false);
    if (!clientId) {
      setNewAppointment((prev) => ({
        ...prev,
        clientId: undefined,
        subscriptionId: undefined,
        owner: "",
        phone: "",
        petName: "",
        paymentMethod: "PIX",
        price: getServicePrice(prev.service),
      }));
      return;
    }

    const client = clients.find((c: Client) => c.id === clientId);
    if (!client) return;

    const activeSub =
      findActiveSubscriptionForClient(client.name) ||
      subscriptions.find((sub) => sub.id === client.activeSubscriptionId);
    const hasPlan = Boolean(activeSub);

    setNewAppointment((prev) => ({
      ...prev,
      clientId: client.id,
      subscriptionId: activeSub?.id,
      owner: client.name,
      phone: client.phone || prev.phone,
      petName: client.petName || prev.petName,
      paymentMethod: hasPlan ? "Plano Mensal" : prev.paymentMethod,
      price: hasPlan ? 0 : getServicePrice(prev.service),
    }));
    setAutoPlanApplied(hasPlan);
  };




  // Geração de dias do mês e cálculo de receita


  const filteredAppointments = appointments.filter((a) => a.date === selectedDate);
  const totalDayRevenue = filteredAppointments.reduce((acc, a) => acc + a.price, 0);
  const monthAppointments = appointments.filter(
    (a) => new Date(a.date).getMonth() === currentDate.getMonth()
  );
  const totalMonthRevenue = monthAppointments.reduce((acc, a) => acc + a.price, 0);

  const isLoading = loadingAppointments || loadingServices || loadingSubscriptions || loadingClients || isAdding || isDeleting || isUpdating || isConfirmingPayment || isCreating;
  // Erros de clientes não bloqueiam a tela; serão exibidos apenas no card de resumo.
  const hasError = errorAppointments || errorServices || errorSubscriptions;

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Erro ao carregar dados!</h2>
        <p>{errorAppointments || errorServices || errorSubscriptions}</p>
        <p>Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div>
      <Header
        onEditPrices={() => setShowEditPricesModal(true)}
        onShowPlans={() => setShowSubscriptionsModal(true)}
        onShowClients={() => navigate("/Clientes")}
        onShowSubscriptionsPage={() => navigate("/Assinaturas")}
        userName={userName}
        onLogout={onLogout}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <CalendarHeader
              currentDate={currentDate}
              onPrevMonth={() => changeMonth(-1)}
              onNextMonth={() => changeMonth(1)}
              onAddAppointment={() => setShowAddModal(true)}
            />

            <CalendarGrid
              days={generateMonthDays(appointments)}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <AppointmentList
              appointments={filteredAppointments}
              selectedDate={selectedDate}
              totalRevenue={totalDayRevenue}
              onDelete={handleDeleteAppointment}
            />
          </div>

          <div className="space-y-6">
            <MonthResume AmountPets={monthAppointments.length} Revenue={totalMonthRevenue} />
            <PricingList services={services} OpenModalEdit={() => setShowEditPricesModal(true)} />
            <AmountMothServices MonthAppointments={monthAppointments} />
            <ClientSummary
              totalClients={clientSummary?.totalClients ?? 0}
              totalPets={clientSummary?.totalPets ?? 0}
              loading={loadingClients}
              error={errorClients}
            />
          </div>
        </div>
      )}

      <AddAppointmentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAppointment}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
        handleServiceChange={handleChangeServiceKeepingPlan}
        clients={clients}
        onSelectClient={handleSelectClient}
        selectedClientId={newAppointment.clientId}
        autoFilledByPlan={autoPlanApplied}
      />

      {ShowEditPricesModal && (
        <EditingPriceServices
          services={services}
          onClose={() => setShowEditPricesModal(false)}
          onSave={handleUpdateServicePrice}
          onCreate={handleCreateService}
          onDelete={handleDeleteService}
        />
      )}

      {showSubscriptionsModal && (
        <PlanManagement
          subscriptions={subscriptions}
          clients={clients}
          onClose={() => setShowSubscriptionsModal(false)}
          onConfirmPayment={handleConfirmSubscriptionPayment}
          onCreateSubscription={createSubscription}
          creatingSubscription={isCreating}
          confirmingPayment={isConfirmingPayment}
        />
      )}

    </div>
  );
}



