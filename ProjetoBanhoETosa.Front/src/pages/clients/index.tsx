import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { useClients } from "../../hooks/useClients";
import { useToast } from "../../Components/common/ToastProvider";
import { AddClientModal } from "../../Components/modals/AddClientModal/AddClientModal";
import { petService, type Pet, type PetCreatePayload } from "../../services/petService";
import type { Client, ClientUpdatePayload } from "../../services/clientService";

const selectClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function ClientsPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const {
    clients,
    loading,
    error,
    saving,
    createClient,
    updateClient,
    deleteClient,
  } = useClients();

  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
  const [processingClientId, setProcessingClientId] = useState<number | null>(null);

  const [clientPets, setClientPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petError, setPetError] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [petForm, setPetForm] = useState({ name: "", species: "" });
  const [savingPet, setSavingPet] = useState(false);
  const [newPetForm, setNewPetForm] = useState({ name: "", species: "" });
  const [addingPet, setAddingPet] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);

  const filteredClients = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return clients;

    return clients.filter((client) => {
      const haystack = [
        client.name,
        client.phone,
        client.email ?? "",
        client.petName ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredClients.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(filteredClients.length, safePage * pageSize);
  const pagedClients = filteredClients.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (!editingClientId) {
      setClientPets([]);
      setSelectedPetId(null);
      setPetForm({ name: "", species: "" });
      setNewPetForm({ name: "", species: "" });
      setShowAddPetForm(false);
      setPetError(null);
      setLoadingPets(false);
      return;
    }

    let active = true;
    setLoadingPets(true);
    setPetError(null);
    petService
      .getByClient(editingClientId)
      .then((data) => {
        if (!active) return;
        setClientPets(data);
      })
      .catch((err: any) => {
        if (!active) return;
        setClientPets([]);
        setPetError(err?.message ?? "Erro ao carregar pets do cliente.");
      })
      .finally(() => {
        if (!active) return;
        setLoadingPets(false);
      });

    return () => {
      active = false;
    };
  }, [editingClientId]);

  useEffect(() => {
    if (clientPets.length === 0) {
      setSelectedPetId(null);
      setPetForm({ name: "", species: "" });
      return;
    }
    const activePet =
      (selectedPetId && clientPets.find((pet) => pet.id === selectedPetId)) || clientPets[0];
    setSelectedPetId(activePet.id);
    setPetForm({
      name: activePet.name ?? "",
      species: activePet.species ?? "",
    });
  }, [clientPets, selectedPetId]);

  const handleAddClient = async (payload: { name: string; phone: string; email?: string; petName: string }) => {
    const success = await createClient(payload);
    if (success) {
      setShowAddClientModal(false);
      pushToast({ message: "Cliente cadastrado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível cadastrar o cliente.", variant: "error" });
    }
    return success;
  };

  const handleStartEdit = (client: Client) => {
    setEditingClientId(client.id);
    setEditForm({
      name: client.name ?? "",
      phone: client.phone ?? "",
      email: client.email ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setEditForm({ name: "", phone: "", email: "" });
    setShowAddPetForm(false);
  };

  const handleSelectPet = (value: string) => {
    const id = Number(value);
    const pet = clientPets.find((item) => item.id === id);
    if (!pet) return;
    setSelectedPetId(id);
    setPetForm({
      name: pet.name ?? "",
      species: pet.species ?? "",
    });
  };

  const handleCreatePet = async () => {
    if (!editingClientId) return;
    if (!newPetForm.name.trim() || !newPetForm.species.trim()) {
      pushToast({ message: "Informe nome e espécie do pet.", variant: "error" });
      return;
    }

    setAddingPet(true);
    const payload: PetCreatePayload = {
      name: newPetForm.name.trim(),
      species: newPetForm.species.trim(),
      clientId: editingClientId,
    };

    try {
      const created = await petService.createPet(payload);
      setClientPets((prev) => [...prev, created]);
      setSelectedPetId(created.id);
      setPetForm({
        name: created.name ?? "",
        species: created.species ?? "",
      });
      setNewPetForm({ name: "", species: "" });
      setShowAddPetForm(false);
      pushToast({ message: "Pet criado com sucesso.", variant: "success" });
    } catch (err: any) {
      pushToast({ message: err?.message ?? "Erro ao criar pet.", variant: "error" });
    } finally {
      setAddingPet(false);
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClientId) return;
    if (!editForm.name.trim() || !editForm.phone.trim()) {
      pushToast({ message: "Nome e telefone são obrigatórios.", variant: "error" });
      return;
    }
    if (selectedPetId && !petForm.name.trim()) {
      pushToast({ message: "Informe o nome do pet.", variant: "error" });
      return;
    }

    setProcessingClientId(editingClientId);
    const payload: ClientUpdatePayload = {
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      email: editForm.email.trim() ? editForm.email.trim() : "",
    };

    const success = await updateClient(editingClientId, payload);
    setProcessingClientId(null);

    if (success) {
      pushToast({ message: "Cliente atualizado com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível atualizar o cliente.", variant: "error" });
    }

    let petSuccess = true;
    if (selectedPetId) {
      setSavingPet(true);
      try {
        const updated = await petService.updatePet(selectedPetId, {
          name: petForm.name.trim(),
          species: petForm.species.trim() ? petForm.species.trim() : undefined,
          clientId: editingClientId,
        });
        setClientPets((prev) => prev.map((pet) => (pet.id === updated.id ? { ...pet, ...updated } : pet)));
        pushToast({ message: "Pet atualizado com sucesso.", variant: "success" });
      } catch (err: any) {
        petSuccess = false;
        pushToast({ message: err?.message ?? "Erro ao atualizar o pet.", variant: "error" });
      } finally {
        setSavingPet(false);
      }
    }

    if (success && petSuccess) {
      handleCancelEdit();
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    const confirm = window.confirm("Deseja excluir este cliente?");
    if (!confirm) return;

    setProcessingClientId(clientId);
    const success = await deleteClient(clientId);
    setProcessingClientId(null);

    if (success) {
      if (editingClientId === clientId) handleCancelEdit();
      pushToast({ message: "Cliente excluído com sucesso.", variant: "success" });
    } else {
      pushToast({ message: "Não foi possível excluir o cliente.", variant: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Petshop</p>
            <h1 className="text-lg font-semibold text-slate-900">Clientes</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/Home")}>Voltar</Button>
            <Button variant="brand" onClick={() => setShowAddClientModal(true)}>Novo cliente</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-6 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Clientes cadastrados</p>
            <p className="text-xs text-slate-500">Mostrando {startIndex}-{endIndex} de {filteredClients.length}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, email ou pet"
              className="sm:w-80"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage <= 1}
              >
                Anterior
              </Button>
              <span className="text-xs text-slate-500">Página {safePage} de {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage >= totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-slate-500">Carregando clientes...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && pagedClients.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum cliente encontrado.</p>
        )}

        <div className="space-y-3">
          {pagedClients.map((client) => {
            const isEditing = editingClientId === client.id;
            const isProcessing = processingClientId === client.id;
            const isSaving = isProcessing || savingPet;

            return (
              <div key={client.id} className="rounded-xl border border-slate-200 bg-white p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Nome</Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={editForm.phone}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Email</Label>
                        <Input
                          value={editForm.email}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="contato@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pet</Label>
                        <select
                          className={selectClass}
                          value={selectedPetId ?? ""}
                          onChange={(e) => handleSelectPet(e.target.value)}
                          disabled={loadingPets || clientPets.length === 0}
                        >
                          {loadingPets && <option value="">Carregando pets...</option>}
                          {!loadingPets && clientPets.length === 0 && (
                            <option value="">Nenhum pet cadastrado</option>
                          )}
                          {!loadingPets &&
                            clientPets.map((pet) => (
                              <option key={pet.id} value={pet.id}>
                                {pet.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Nome do Pet</Label>
                        <Input
                          value={petForm.name}
                          onChange={(e) => setPetForm((prev) => ({ ...prev, name: e.target.value }))}
                          disabled={!selectedPetId}
                          placeholder="Rex"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Espécie</Label>
                        <Input
                          value={petForm.species}
                          onChange={(e) => setPetForm((prev) => ({ ...prev, species: e.target.value }))}
                          disabled={!selectedPetId}
                          placeholder="Cachorro"
                        />
                      </div>
                    </div>

                    {petError && <p className="text-sm text-amber-600">{petError}</p>}
                    {!loadingPets && clientPets.length === 0 && (
                      <p className="text-sm text-slate-500">Este cliente não possui pets cadastrados.</p>
                    )}

                    {showAddPetForm ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">Adicionar novo pet</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAddPetForm(false)}
                          >
                            Fechar
                          </Button>
                        </div>
                        <div className="mt-2 grid gap-2 md:grid-cols-3 md:items-end">
                          <div className="space-y-2">
                            <Label>Nome do Pet</Label>
                            <Input
                              value={newPetForm.name}
                              onChange={(e) => setNewPetForm((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="Rex"
                              disabled={addingPet}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Espécie</Label>
                            <Input
                              value={newPetForm.species}
                              onChange={(e) => setNewPetForm((prev) => ({ ...prev, species: e.target.value }))}
                              placeholder="Cachorro"
                              disabled={addingPet}
                            />
                          </div>
                          <div className="md:pb-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleCreatePet}
                              disabled={addingPet}
                              className="w-full"
                            >
                              {addingPet ? "Adicionando..." : "Adicionar pet"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddPetForm(true)}
                        className="w-full"
                      >
                        Adicionar novo pet
                      </Button>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="w-full"
                        disabled={isSaving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="brand"
                        onClick={handleUpdateClient}
                        className="w-full"
                        disabled={isSaving}
                      >
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{client.name}</p>
                      <p className="text-sm text-slate-500 break-words">{client.phone}</p>
                      {client.email && <p className="text-sm text-slate-500 break-words">{client.email}</p>}
                      {client.petName && (
                        <p className="text-sm text-slate-500">Pet: {client.petName}</p>
                      )}
                    </div>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(client)}
                        disabled={isProcessing}
                        className="w-full sm:w-auto"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        disabled={isProcessing}
                        className="w-full sm:w-auto"
                      >
                        {isProcessing ? "Excluindo..." : "Excluir"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <AddClientModal
        show={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onSubmit={handleAddClient}
        isSubmitting={saving}
        error={error}
      />
    </div>
  );
}
