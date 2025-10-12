import React from "react";
import ReactDOM from "react-dom";

export interface Appointment {
  petName: string;
  owner: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  phone: string;
  price: number;
}

interface AddAppointmentModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newAppointment: Appointment;
  setNewAppointment: (value: Appointment) => void;
  handleServiceChange: (service: string) => void;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  show,
  onClose,
  onSubmit,
  newAppointment,
  setNewAppointment,
  handleServiceChange,
}) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]">
        <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Novo Agendamento</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pet</label>
            <input
              type="text"
              value={newAppointment.petName}
              onChange={(e) => setNewAppointment({ ...newAppointment, petName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Dono</label>
            <input
              type="text"
              value={newAppointment.owner}
              onChange={(e) => setNewAppointment({ ...newAppointment, owner: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={newAppointment.phone}
              onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
            <select
              value={newAppointment.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Banho e Tosa</option>
              <option>Banho</option>
              <option>Tosa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>
              <input
                type="number"
                value={newAppointment.price}
                onChange={(e) => setNewAppointment({ ...newAppointment, price: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddAppointmentModal;
