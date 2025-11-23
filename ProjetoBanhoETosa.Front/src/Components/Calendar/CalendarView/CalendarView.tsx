import React, { useState, useEffect, useCallback } from "react";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import AppointmentList from "../../AppointmentList/AppointmentList";
import type { Appointment } from "../../../interfaces/Appointment";
import AddAppointmentModal from "../../modals/AddAppointmentModal/AddAppointmentModal";
import EditingPriceServices from "../../modals/EditingPriceServices/EditingPriceServices";
import PlanManagement from "../../modals/PlanManagement/PlanManagement";
import MonthResume from "../../MonthResume/MonthResume";
import PricingList from "../../PricingList/PricingList";
import AmountMothServices from "../../modals/AmountMonthServices/AmountMothServices";
import Header from "../../Header/Header";
import style from "./CalendarView.module.css";
import { useAppointments } from "../../../hooks/useAppointments";
import { useServices } from "../../../hooks/useServices";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useCalendar } from "../../../hooks/useCalendar";
import { useNewAppointmentForm } from "../../../hooks/useNewAppointmentForm"; // Import the new hook

export default function CalendarView() {
  const [ShowEditPricesModal, setShowEditPricesModal] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [tempPrice, setTempPrice] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const { appointments, addAppointment, deleteAppointment, refetchAppointments } = useAppointments();
  const { services, updateServicePrice, refetchServices } = useServices();
  const { subscriptions, confirmSubscriptionPayment, refetchSubscriptions } = useSubscriptions();
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
      setEditingService(null);
      setTempPrice("");
      refetchServices(); // Re-fetch services to ensure UI is updated
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
      refetchAppointments(); // Re-fetch appointments to ensure UI is updated
    }
  };

  // Excluir agendamento
  const handleDeleteAppointment = async (id: number) => {
    const success = await deleteAppointment(id);
    if (success) {
      refetchAppointments(); // Re-fetch appointments to ensure UI is updated
    }
  };

  // Confirmar pagamento de assinatura
  const handleConfirmSubscriptionPayment = async (subscriptionId: number) => {
    const success = await confirmSubscriptionPayment(subscriptionId);
    if (success) {
      refetchSubscriptions(); // Re-fetch subscriptions to ensure UI is updated
    }
  };



  // Atualiza o preço conforme o serviço
  const handleServiceChange = (service: string) => {
    const selectedService = services.find((s) => s.name === service);
    const price = selectedService ? selectedService.price : 80;
    setNewAppointment({ ...newAppointment, service, price });
  };

  // Geração de dias do mês e cálculo de receita


  const filteredAppointments = appointments.filter((a) => a.date === selectedDate);
  const totalDayRevenue = filteredAppointments.reduce((acc, a) => acc + a.price, 0);
  const monthAppointments = appointments.filter(
    (a) => new Date(a.date).getMonth() === currentDate.getMonth()
  );
  const totalMonthRevenue = monthAppointments.reduce((acc, a) => acc + a.price, 0);

  return (
    <div>
      <Header
        onEditPrices={() => setShowEditPricesModal(true)}
        onShowPlans={() => setShowSubscriptionsModal(true)}
      />

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
