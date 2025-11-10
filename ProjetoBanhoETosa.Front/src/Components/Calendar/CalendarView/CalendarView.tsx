import React, { useEffect, useState } from "react";
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

export default function CalendarView() {
  const [ShowEditPricesModal, setShowEditPricesModal] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
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
    paymentMethod: "PIX"
  });

  // Atualizar preço de serviço
  const handleUpdateServicePrice = async (serviceId: number,newPrice: number) => {
    
    console.log(newPrice)
    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Por favor, insira um preço válido!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5159/api/Services/UpdateService/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrice),
      });

      if (!response.ok) throw new Error("Erro ao atualizar serviço");

      const data = await response.json();
      alert(data.message);

      setServices(services.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s)));
      setEditingService(null);
      setTempPrice("");
    } catch (error) {
      alert("Erro ao atualizar o serviço!");
      console.error(error);
    }
  };

  // Adicionar agendamento
  const handleAddAppointment = async () => {
    if (!newAppointment.petName || !newAppointment.owner || !newAppointment.date || !newAppointment.time) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5159/api/Appointments/NewAppointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) throw new Error("Erro ao adicionar horário");

      const data = await response.json();
      alert(data.message);

      // Atualiza lista
      setAppointments((prev) => [...prev, data.appointment]);
      setShowAddModal(false);

      // Resetar form
      setNewAppointment({
        id: 0,
        petName: "",
        owner: "",
        service: "Banho e Tosa",
        time: "",
        price: 80,
        phone: "",
        date: selectedDate,
        paymentMethod: "PIX"
      });
    } catch (error) {
      alert("Erro ao adicionar agendamento!");
      console.error(error);
    }
  };

  // Excluir agendamento
  const handleDeleteAppointment = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      const response = await fetch(`http://localhost:5159/api/Appointments/DeleteAppointment/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir agendamento");

      const data = await response.json();
      alert(data.message);

      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      alert("Erro ao excluir agendamento!");
      console.error(error);
    }
  };

  // Confirmar pagamento de assinatura
  const handleConfirmSubscriptionPayment = async (subscriptionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5159/api/Subscriptions/ConfirmPayment/${subscriptionId}`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Erro ao confirmar pagamento");

      const data = await response.json();
      alert(data.message);

      setSubscriptions((subs) =>
        subs.map((s) =>
          s.id === subscriptionId ? { ...s, paymentStatus: "pago" } : s
        )
      );
    } catch (error) {
      alert("Erro ao confirmar pagamento!");
      console.error(error);
    }
  };

  // Buscar todos os dados (agendamentos, serviços, planos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, servRes, subsRes] = await Promise.all([
          fetch("http://localhost:5159/api/Appointments/GetAllAppointments"),
          fetch("http://localhost:5159/api/Services/GetAllServices"),
          fetch("http://localhost:5159/api/Subscriptions/GetAllSubscriptions"),
        ]);

        if (!appsRes.ok || !servRes.ok){
          throw new Error("Erro ao carregar dados");
        }

        const [appsData, servData, subsData] = await Promise.all([
          appsRes.json(),
          servRes.json(),
          subsRes.json(),
        ]);
        
        setAppointments(appsData.appointments || []);
        setServices(servData.services || []);
        setSubscriptions(subsData.subscription || []);
      } catch (error) {
        alert("Erro ao carregar dados do servidor!");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Atualiza o preço conforme o serviço
  const handleServiceChange = (service: string) => {
    const selectedService = services.find((s) => s.name === service);
    const price = selectedService ? selectedService.price : 80;
    setNewAppointment({ ...newAppointment, service, price });
  };

  // Geração de dias do mês e cálculo de receita
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: any[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day).toISOString().split("T")[0];
      const dayAppointments = appointments.filter((a) => a.date === date);
      const totalRevenue = dayAppointments.reduce((acc, a) => acc + a.price, 0);

      days.push({ day, date, count: dayAppointments.length, revenue: totalRevenue });
    }

    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

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
