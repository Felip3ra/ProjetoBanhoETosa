import React, { useState } from "react";
import AddAppointmentModal from "./AddAppointmentModal";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Dog,
  Clock,
  Scissors,
  DollarSign,
  Edit2,
  Check,
  AlertCircle
} from "lucide-react";
import MonthResume from "./MonthResume";
import PricingList from "./PricingList";
import AmountMothServices from "./AmountMothServices";
import Header from "./Header";
interface Appointment {
  id: number;
  petName: string;
  owner: string;
  service: string;
  time: string;
  price: number;
  phone: string;
  date: string;
}

export default function CalendarView() {
  
  const [ShowEditPricesModal,setShowEditPricesModal] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [services, setServices] = useState([
    { id: 1, name: 'Banho e Tosa', price: 80.00, duration: 90, active: true },
    { id: 2, name: 'Banho', price: 50.00, duration: 45, active: true },
    { id: 3, name: 'Tosa', price: 60.00, duration: 60, active: true }
  ]);
  const handleUpdateServicePrice = (serviceId) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Por favor, insira um preço válido!');
      return;
    }
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, price: newPrice } : s
    ));
    setEditingService(null);
    setTempPrice('');
  };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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
    { id: 1, customerName: 'Pedro Costa', planName: 'Plano Básico', startDate: '2025-10-01', endDate: '2025-10-31', price: 200, servicesUsed: 1, servicesAvailable: 4, paymentStatus: 'pago' },
    { id: 2, customerName: 'Ana Lima', planName: 'Plano Premium', startDate: '2025-10-05', endDate: '2025-11-05', price: 350, servicesUsed: 3, servicesAvailable: 8, paymentStatus: 'pendente' }
  ]);

  // Atualiza preço conforme o serviço
  const handleServiceChange = (service: string) => {
    let price = 80;
    if (service === "Banho") price = 50;
    if (service === "Tosa") price = 60;

    setNewAppointment({ ...newAppointment, service, price });
  };

  // Adiciona um novo agendamento
  const handleAddAppointment = () => {
    if (
      !newAppointment.petName ||
      !newAppointment.owner ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
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
  const filteredAppointments = appointments.filter(
    (a) => a.date === selectedDate
  );

  const totalDayRevenue = filteredAppointments.reduce(
    (acc, a) => acc + a.price,
    0
  );

  const monthAppointments = appointments.filter(
    (a) => new Date(a.date).getMonth() === currentDate.getMonth()
  );

  const totalMonthRevenue = monthAppointments.reduce(
    (acc, a) => acc + a.price,
    0
  );

  const handleDeleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleConfirmSubscriptionPayment = (subscriptionId) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === subscriptionId ? { ...sub, paymentStatus: 'pago' } : sub
    ));
    alert('Pagamento do plano confirmado com sucesso!');
  };

  return (
    <div>
      <Header onEditPrices={() => setShowEditPricesModal(true)} onShowPlans={() => setShowSubscriptionsModal(true)}/>
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CALENDÁRIO */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                {currentDate
                  .toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Agendamento
            </button>
          </div>

          {/* Cabeçalho dos dias */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {generateMonthDays().map((day, index) =>
              day === null ? (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ) : (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`aspect-square p-2 rounded-lg text-center transition-all ${
                    day.date === selectedDate
                      ? "bg-blue-600 text-white shadow-lg"
                      : day.count > 0
                      ? "bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-lg font-bold">{day.day}</div>
                  {day.count > 0 && (
                    <div
                      className={`text-xs mt-1 ${
                        day.date === selectedDate
                          ? "text-blue-200"
                          : "text-blue-600"
                      }`}
                    >
                      {day.count} 🐕
                    </div>
                  )}
                  {day.revenue > 0 && (
                    <div
                      className={`text-xs font-semibold ${
                        day.date === selectedDate
                          ? "text-green-200"
                          : "text-green-600"
                      }`}
                    >
                      R${day.revenue}
                    </div>
                  )}
                </button>
              )
            )}
          </div>

          {/* Lista de agendamentos */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">
              Agendamentos de{" "}
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "long" }
              )}
            </h3>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Dog className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum agendamento para este dia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Dog className="w-5 h-5 text-blue-600" />
                          <h4 className="font-bold text-gray-800">
                            {apt.petName}
                          </h4>
                          <span className="text-sm text-gray-600">
                            ({apt.owner})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Scissors className="w-4 h-4" />
                            {apt.service}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-green-600">
                            <DollarSign className="w-4 h-4" />
                            R$ {apt.price.toFixed(2)}
                          </span>
                          <span>📞 {apt.phone}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="bg-green-100 p-4 rounded-lg border border-green-300 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-800">
                      Total do Dia:
                    </span>
                    <span className="text-2xl font-bold text-green-700">
                      R$ {totalDayRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESUMO DO MÊS */}
        <div className="space-y-6">

          <MonthResume AmountPets={monthAppointments.length} Revenue={totalMonthRevenue}/>
          <PricingList services={services}/>
          <AmountMothServices MonthAppointments={monthAppointments}/>
        </div>
        
      </div>

      {/* MODAL DE NOVO AGENDAMENTO */}
      <AddAppointmentModal
  show={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSubmit={handleAddAppointment}
  newAppointment={newAppointment}
  setNewAppointment={setNewAppointment}
  handleServiceChange={handleServiceChange}
/>
      {/*MODAL DE EDICAO DE PRECO*/}
      {ShowEditPricesModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]" onClick={() => setShowEditPricesModal(false)}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Editar Preços dos Serviços</h3>
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{service.name}</h4>
                    <span className="text-sm text-gray-500">{service.duration} min</span>
                  </div>
                  {editingService === service.id ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">R$</span>
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          placeholder={service.price.toFixed(2)}
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateServicePrice(service.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingService(null);
                            setTempPrice('');
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">R$ {service.price.toFixed(2)}</span>
                      <button
                        onClick={() => {
                          setEditingService(service.id);
                          setTempPrice(service.price.toString());
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => setShowEditPricesModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-4"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {/*MODAL DE PLANOS */}
      {showSubscriptionsModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]" onClick={() => setShowSubscriptionsModal(false)}>
          <div className="absolute bg-black opacity-50 inset-0"></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gerenciar Planos Mensais</h3>
            <div className="space-y-4">
              {subscriptions.map(sub => {
                const daysLeft = Math.ceil((new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isExpiring = daysLeft <= 7 && daysLeft >= 0;
                const isExpired = daysLeft < 0;
                
                return (
                  <div key={sub.id} className={`p-4 border-2 rounded-lg ${
                    isExpired ? 'border-red-300 bg-red-50' :
                    isExpiring ? 'border-yellow-300 bg-yellow-50' :
                    'border-green-300 bg-green-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{sub.customerName}</h4>
                        <p className="text-sm text-gray-600">{sub.planName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.paymentStatus === 'pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sub.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Início:</span>
                        <span className="font-semibold ml-1">{new Date(sub.startDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Término:</span>
                        <span className="font-semibold ml-1">{new Date(sub.endDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Serviços:</span>
                        <span className="font-semibold ml-1">{sub.servicesUsed}/{sub.servicesAvailable}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-semibold ml-1 text-green-600">R$ {sub.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {isExpiring && sub.paymentStatus === 'pendente' && (
                      <div className="flex items-center gap-2 text-yellow-700 text-sm mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Expira em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</span>
                      </div>
                    )}
                    
                    {isExpired && (
                      <div className="flex items-center gap-2 text-red-700 text-sm mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Vencido há {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? 'dia' : 'dias'}</span>
                      </div>
                    )}
                    
                    {sub.paymentStatus === 'pendente' && (
                      <button
                        onClick={() => handleConfirmSubscriptionPayment(sub.id)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                      >
                        Confirmar Pagamento
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => setShowSubscriptionsModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-4"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
