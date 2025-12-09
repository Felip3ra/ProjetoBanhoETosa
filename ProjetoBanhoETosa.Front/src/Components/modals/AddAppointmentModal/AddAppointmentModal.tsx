import React from "react";
import ReactDOM from "react-dom";
import type { AddAppointmentModalProps } from "../../../interfaces/Appointment";
import type { Client } from "../../../services/clientService";
import styles from "./AddAppointmentModal.module.css";

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  show,
  onClose,
  onSubmit,
  newAppointment,
  setNewAppointment,
  handleServiceChange,
  clients = [],
  onSelectClient,
  selectedClientId,
  autoFilledByPlan,
}) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className={styles['Container']}>
        <div className={styles['Container-Background']}></div>
      <div className={styles['Container-Modal']}>
        <h3 className={styles['Container-Modal-Tittle']}>Novo Agendamento</h3>
        <div className="space-y-4">
          <div>
            <label className={styles.Label}>Cliente (opcional)</label>
            <select
              className={styles.Input}
              value={selectedClientId ?? ""}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : undefined;
                onSelectClient?.(id);
              }}
            >
              <option value="">Sem cliente cadastrado</option>
              {clients.map((c: Client) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.activePlanName ? `- ${c.activePlanName}` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Selecionar cliente preenche dono/telefone/pet. Se tiver plano ativo, ajusta pagamento.</p>
          </div>

          <div>
            <label className={styles.Label}>Nome do Pet</label>
            <input
              type="text"
              value={newAppointment.petName}
              onChange={(e) => setNewAppointment({ ...newAppointment, petName: e.target.value })}
              className={styles.Input}
            />
          </div>

          <div>
            <label className={styles.Label}>Nome do Dono</label>
            <input
              type="text"
              value={newAppointment.owner}
              onChange={(e) => setNewAppointment({ ...newAppointment, owner: e.target.value })}
              className={styles.Input}
            />
          </div>

          <div>
            <label className={styles.Label}>Telefone</label>
            <input
              type="tel"
              value={newAppointment.phone}
              onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              className={styles.Input}
            />
          </div>

          <div>
            <label className={styles.Label}>Serviço</label>
            <select
              value={newAppointment.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className={styles.Input}
            >
              <option>Banho e Tosa</option>
              <option>Banho</option>
              <option>Tosa</option>
            </select>
          </div>

          <div>
            <label className={styles.Label}>Forma de Pagamento</label>
            <select
              value={newAppointment.paymentMethod}
              onChange={(e) => setNewAppointment({ ...newAppointment, paymentMethod: e.target.value })}
              className={styles.Input}
            >
              <option value="PIX">PIX</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Plano Mensal">Plano Mensal</option>
            </select>
            {autoFilledByPlan && (
              <p className="text-xs text-purple-600 mt-1">Pagamento via plano ativo do cliente.</p>
            )}
          </div>

          <div>
                <label className={styles.Label}>Preço</label>
                <div className="relative">
                  {/* <span className="absolute left-3 top-2 text-gray-500">R$</span> */}
                  <input
                    type="number"
                    value={newAppointment.price}
                    onChange={(e) => setNewAppointment({ ...newAppointment, price: parseFloat(e.target.value) || 0 })}
                    className={styles.Input}
                    step="0.01"
                    disabled={newAppointment.paymentMethod === "Plano Mensal"}
                  />
                </div>
                {newAppointment.paymentMethod === "Plano Mensal" && (
                  <p className="text-xs text-purple-600 mt-1">Valor coberto pelo plano mensal</p>
                )}
              </div>

          <div>
            <label className={styles['Label']}>Data</label>
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className={styles['Input']}
            />
          </div>

          <div>
            <label className={styles['Label']}>Horário</label>
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              className={styles['Input']}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className={styles['Button-Close']}
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              className={styles['Button-Save']}
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
