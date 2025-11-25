import React, { useState, useEffect } from "react";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import AppointmentList from "../../AppointmentList/AppointmentList";
import type { Appointment } from "../../../interfaces/Appointment";
import AddAppointmentModal from "../../modals/AddAppointmentModal/AddAppointmentModal";
import EditingPriceServices from "../../modals/EditingPriceServices/EditingPriceServices";
import PlanManagement from "../../modals/PlanManagement/PlanManagement";
import MonthResume from "../../MonthResume/MonthResume";
import PricingList from "../../PricingList/PricingList";
import AmountMothServices from "../../modals/AmountMonthServices/AmountMonthServices";
import Header from "../../Header/Header";
import style from "./CalendarView.module.css";
import { useAppointments } from "../../../hooks/useAppointments";
import { useServices } from "../../../hooks/useServices";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useCalendar } from "../../../hooks/useCalendar";
import { useNewAppointmentForm } from "../../../hooks/useNewAppointmentForm";
import LoadingSpinner from "../../common/LoadingSpinner"; // Import the new LoadingSpinner component

export default function CalendarView() {
  const [ShowEditPricesModal, setShowEditPricesModal] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const { appointments: appointmentsFromHook, addAppointment, deleteAppointment, refetchAppointments, loading: loadingAppointments, isAdding, isDeleting, error: errorAppointments } = useAppointments();
  const appointments = appointmentsFromHook || []; // Defensive check
  const { services: servicesFromHook, updateServicePrice, refetchServices, loading: loadingServices, isUpdating, error: errorServices } = useServices();
  const services = servicesFromHook || []; // Defensive check
  const { subscriptions: subscriptionsFromHook, confirmSubscriptionPayment, refetchSubscriptions, loading: loadingSubscriptions, isConfirmingPayment, error: errorSubscriptions } = useSubscriptions();
  const subscriptions = subscriptionsFromHook || []; // Defensive check
  const { currentDate, selectedDate, changeMonth, generateMonthDays, setSelectedDate } = useCalendar();
  const { newAppointment, setNewAppointment, handleServiceChange, resetForm } = useNewAppointmentForm(services, selectedDate);


  useEffect(() => {
    // Refetch all data when component mounts or a relevant action occurs
    const fetchData = async () => {
      await Promise.all([refetchAppointments(), refetchServices(), refetchSubscriptions()]);
    };
    fetchData();
  }, [refetchAppointments, refetchServices, refetchSubscriptions]);

  // Atualizar preço de serviço
  const handleUpdateServicePrice = async (serviceId: number, newPrice: number) => {
    const success = await updateServicePrice(serviceId, newPrice);
    if (success) {
      // refetchServices(); // Re-fetch services to ensure UI is updated
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
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    const success = await addAppointment({ ...newAppointment, date: selectedDate });
    if (success) {
      setShowAddModal(false);
      resetForm(); // Use resetForm from the hook
    }
  };

  // Excluir agendamento
  const handleDeleteAppointment = async (id: number) => {
    await deleteAppointment(id);
  };

  // Confirmar pagamento de assinatura
  const handleConfirmSubscriptionPayment = async (subscriptionId: number) => {
    const success = await confirmSubscriptionPayment(subscriptionId);
    if (success) {
      // refetchSubscriptions(); // Re-fetch subscriptions to ensure UI is updated
    }
  };





  // Geração de dias do mês e cálculo de receita


  const filteredAppointments = appointments.filter((a) => a.date === selectedDate);
  const totalDayRevenue = filteredAppointments.reduce((acc, a) => acc + a.price, 0);
  const monthAppointments = appointments.filter(
    (a) => new Date(a.date).getMonth() === currentDate.getMonth()
  );
  const totalMonthRevenue = monthAppointments.reduce((acc, a) => acc + a.price, 0);

  const isLoading = loadingAppointments || loadingServices || loadingSubscriptions || isAdding || isDeleting || isUpdating || isConfirmingPayment;
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
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={style["Container-Calendar-View"]}>
          <div className={style["Container-Calendar-Main-Column"]}>
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
          </div>
        </div>
      )}

      <AddAppointmentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAppointment}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
        handleServiceChange={handleServiceChange}
      />

      {ShowEditPricesModal && (
        <EditingPriceServices
          services={services}
          onClose={() => setShowEditPricesModal(false)}
          onSave={handleUpdateServicePrice}
        />
      )}

      {showSubscriptionsModal && (
        <PlanManagement
          subscriptions={subscriptions}
          onClose={() => setShowSubscriptionsModal(false)}
          onConfirmPayment={handleConfirmSubscriptionPayment}
        />
      )}
    </div>
  );
}
