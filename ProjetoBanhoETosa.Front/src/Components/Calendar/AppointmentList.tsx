import { Dog, Clock, Scissors, DollarSign } from "lucide-react";
import type { Appointment } from "./type";

interface AppointmentListProps {
  appointments: Appointment[];
  selectedDate: string;
  totalRevenue: number;
  onDelete: (id: number) => void;
}

export default function AppointmentList({ appointments, selectedDate, totalRevenue, onDelete }: AppointmentListProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-4">
        Agendamentos de{" "}
        {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        })}
      </h3>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Dog className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum agendamento para este dia</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Dog className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-gray-800">{apt.petName}</h4>
                    <span className="text-sm text-gray-600">({apt.owner})</span>
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
                <button onClick={() => onDelete(apt.id)} className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          ))}
          <div className="bg-green-100 p-4 rounded-lg border border-green-300 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-800">Total do Dia:</span>
              <span className="text-2xl font-bold text-green-700">R$ {totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
