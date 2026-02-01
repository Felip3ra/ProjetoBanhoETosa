import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import type { AddAppointmentModalProps } from "../../../interfaces/Appointment";
import type { Client } from "../../../services/clientService";
import { petService, type Pet } from "../../../services/petService";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const selectClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

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
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petError, setPetError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    if (!selectedClientId) {
      setPets([]);
      setPetError(null);
      setLoadingPets(false);
      return;
    }

    let active = true;
    setLoadingPets(true);
    setPetError(null);
    petService
      .getByClient(selectedClientId)
      .then((data) => {
        if (!active) return;
        setPets(data);
      })
      .catch((error: any) => {
        if (!active) return;
        setPets([]);
        setPetError(error?.message ?? "Erro ao carregar pets do cliente.");
      })
      .finally(() => {
        if (!active) return;
        setLoadingPets(false);
      });

    return () => {
      active = false;
    };
  }, [selectedClientId, show]);

  const petOptions = useMemo(() => {
    const names = pets.map((pet) => pet.name).filter((name) => name?.trim());
    return Array.from(new Set(names));
  }, [pets]);

  useEffect(() => {
    if (petOptions.length === 0) return;
    if (newAppointment.petName && petOptions.includes(newAppointment.petName)) return;
    setNewAppointment({ ...newAppointment, petName: petOptions[0] });
  }, [petOptions, newAppointment, setNewAppointment]);

  const hasClientSelected = Boolean(selectedClientId);
  const showPetSelect = hasClientSelected && (loadingPets || petOptions.length > 0);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <Card className="border-slate-200/80 shadow-2xl">
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Cliente (opcional)</Label>
              <select
                className={selectClass}
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
              <p className="text-xs text-slate-500">
                Selecionar cliente preenche dono/telefone/pet. Se tiver plano ativo, ajusta pagamento.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Pet</Label>
                {showPetSelect ? (
                  <select
                    className={selectClass}
                    value={newAppointment.petName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, petName: e.target.value })}
                    disabled={loadingPets || petOptions.length === 0}
                  >
                    {loadingPets && <option value="">Carregando pets...</option>}
                    {!loadingPets && petOptions.length === 0 && (
                      <option value="">Nenhum pet cadastrado</option>
                    )}
                    {!loadingPets &&
                      petOptions.map((pet) => (
                        <option key={pet} value={pet}>
                          {pet}
                        </option>
                      ))}
                  </select>
                ) : (
                  <Input
                    type="text"
                    value={newAppointment.petName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, petName: e.target.value })}
                    placeholder="Nome do pet"
                  />
                )}
                {hasClientSelected && !loadingPets && petOptions.length === 0 && (
                  <p className="text-xs text-slate-500">Cliente sem pets cadastrados. Informe manualmente.</p>
                )}
                {petError && <p className="text-xs text-amber-600">{petError}</p>}
              </div>

              <div className="space-y-2">
                <Label>Nome do Dono</Label>
                <Input
                  type="text"
                  value={newAppointment.owner}
                  onChange={(e) => setNewAppointment({ ...newAppointment, owner: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  type="tel"
                  value={newAppointment.phone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label>Serviço</Label>
                <select
                  value={newAppointment.service}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className={selectClass}
                >
                  <option>Banho e Tosa</option>
                  <option>Banho</option>
                  <option>Tosa</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <select
                  value={newAppointment.paymentMethod}
                  onChange={(e) => setNewAppointment({ ...newAppointment, paymentMethod: e.target.value })}
                  className={selectClass}
                >
                  <option value="PIX">PIX</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Plano Mensal">Plano Mensal</option>
                </select>
                {autoFilledByPlan && (
                  <p className="text-xs text-blue-600">Pagamento via plano ativo do cliente.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  type="number"
                  value={newAppointment.price}
                  onChange={(e) => setNewAppointment({ ...newAppointment, price: parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  disabled={newAppointment.paymentMethod === "Plano Mensal"}
                />
                {newAppointment.paymentMethod === "Plano Mensal" && (
                  <p className="text-xs text-blue-600">Valor coberto pelo plano mensal</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Horário</Label>
                <Input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="button" variant="brand" onClick={onSubmit} className="w-full sm:w-auto">
                Agendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
};

export default AddAppointmentModal;
