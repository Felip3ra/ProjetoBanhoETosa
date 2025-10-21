import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import AppointmentList from "./AppointmentList";
import type { Appointment } from "./type";
import AddAppointmentModal from "../modals/AddAppointmentModal";
import EditingPriceServices from "../modals/EditingPriceServices";
import PlanManagement from "../modals/PlanManagement";
import MonthResume from "../MonthResume";
import PricingList from "../PricingList";
import AmountMothServices from "../modals/AmountMothServices";
import Header from "../Header";

export default function CalendarView() {
  const [ShowEditPricesModal, setShowEditPricesModal] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [services, setServices] = useState([
    { id: 1, name: "Banho e Tosa", price: 80.0, duration: 90, active: true },
    { id: 2, name: "Banho", price: 50.0, duration: 45, active: true },
    { id: 3, name: "Tosa", price: 60.0, duration: 60, active: true },
  ]);

  const handleUpdateServicePrice = (serviceId: number) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Por favor, insira um preço válido!");
      return;
    }
    setServices(services.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s)));
    setEditingService(null);
    setTempPrice("");
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAppointment, setNewAppointment] = useState<Appointment>({
    id: 0,
    petName: "",
    owner: "",
    service: "Banho e Tosa",
    time: "",
    price: 80,
    phone: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [subscriptions, setSubscriptions] = useState([
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

  // Atualiza o preço conforme o serviço
  const handleServiceChange = (service: string) => {
    let price = 80;
    if (service === "Banho") price = 50;
    if (service === "Tosa") price = 60;
    setNewAppointment({ ...newAppointment, service, price });
  };

  // Adiciona um novo agendamento
  const handleAddAppointment = () => {
    if (!newAppointment.petName || !newAppointment.owner || !newAppointment.date || !newAppointment.time) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const newId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 1;
    const appointment = { ...newAppointment, id: newId };

    setAppointments([...appointments, appointment]);
    setShowAddModal(false);

    // reseta o formulário
    setNewAppointment({
      id: 0,
      petName: "",
      owner: "",
      service: "Banho e Tosa",
      time: "",
      price: 80,
      phone: "",
      date: selectedDate,
    });
  };

  // Gera todos os dias do mês atual
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: any[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day).toISOString().split("T")[0];
      const dayAppointments = appointments.filter((a) => a.date === date);
      const totalRevenue = dayAppointments.reduce((acc, a) => acc + a.price, 0);

      days.push({
        day,
        date,
        count: dayAppointments.length,
        revenue: totalRevenue,
      });
    }

    return days;
  };

  // Muda o mês
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Filtra os agendamentos do dia selecionado
  const filteredAppointments = appointments.filter((a) => a.date === selectedDate);
  const totalDayRevenue = filteredAppointments.reduce((acc, a) => acc + a.price, 0);

  const monthAppointments = appointments.filter(
    (a) => new Date(a.date).getMonth() === currentDate.getMonth()
  );
  const totalMonthRevenue = monthAppointments.reduce((acc, a) => acc + a.price, 0);

  const handleDeleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleConfirmSubscriptionPayment = (subscriptionId: number) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === subscriptionId ? { ...sub, paymentStatus: "pago" } : sub
      )
    );
    alert("Pagamento do plano confirmado com sucesso!");
  };

  return (
    <div>
      <Header
        onEditPrices={() => setShowEditPricesModal(true)}
        onShowPlans={() => setShowSubscriptionsModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA PRINCIPAL */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
            onAddAppointment={() => setShowAddModal(true)}
          />

          <CalendarGrid
            days={generateMonthDays()}
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

        {/* SIDEBAR */}
        <div className="space-y-6">
          <MonthResume AmountPets={monthAppointments.length} Revenue={totalMonthRevenue} />
          <PricingList
            services={services}
            OpenModalEdit={() => setShowEditPricesModal(true)}
          />
          <AmountMothServices MonthAppointments={monthAppointments} />
        </div>
      </div>

      {/* MODAIS */}
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
          onSave={(serviceId, newPrice) => {
            setServices((prev) =>
              prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s))
            );
          }}
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
