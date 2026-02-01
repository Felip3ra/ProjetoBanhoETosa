export interface Pet {
  id: number;
  name: string;
  species?: string;
  breed?: string;
  age?: number;
  notes?: string;
  clientId: number;
  planId?: number;
}

export interface PetUpdatePayload {
  name: string;
  species?: string;
  breed?: string;
  age?: number;
  notes?: string;
  clientId?: number;
  planId?: number;
}

export interface PetCreatePayload {
  name: string;
  species: string;
  clientId: number;
  breed?: string;
  age?: number;
  notes?: string;
  planId?: number;
}

const API_BASE_URL = "/api";

export const petService = {
  getByClient: async (clientId: number): Promise<Pet[]> => {
    if (!clientId) return [];
    const response = await fetch(`${API_BASE_URL}/Pets/ByClient/${clientId}`);
    if (!response.ok) {
      if (response.status === 404) return [];
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao carregar pets do cliente");
    }
    const data = await response.json().catch(() => []);
    const list = Array.isArray(data) ? data : data.pets || data.Pets || [];
    return list.map((p: any) => ({
      id: p.id ?? p.Id ?? 0,
      name: p.name ?? p.Name ?? "",
      species: p.species ?? p.Species,
      breed: p.breed ?? p.Breed,
      age: p.age ?? p.Age,
      notes: p.notes ?? p.Notes,
      clientId: p.clientId ?? p.ClientId ?? clientId,
      planId: p.planId ?? p.PlanId,
    }));
  },

  createPet: async (payload: PetCreatePayload): Promise<Pet> => {
    const response = await fetch(`${API_BASE_URL}/Pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao criar pet");
    }

    const data = await response.json().catch(() => ({}));
    return {
      id: data.id ?? data.Id ?? 0,
      name: data.name ?? data.Name ?? payload.name,
      species: data.species ?? data.Species ?? payload.species,
      breed: data.breed ?? data.Breed ?? payload.breed,
      age: data.age ?? data.Age ?? payload.age,
      notes: data.notes ?? data.Notes ?? payload.notes,
      clientId: data.clientId ?? data.ClientId ?? payload.clientId,
      planId: data.planId ?? data.PlanId ?? payload.planId,
    };
  },

  updatePet: async (id: number, payload: PetUpdatePayload): Promise<Pet> => {
    const response = await fetch(`${API_BASE_URL}/Pets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao atualizar pet");
    }

    const data = await response.json().catch(() => ({}));
    return {
      id: data.id ?? data.Id ?? id,
      name: data.name ?? data.Name ?? payload.name,
      species: data.species ?? data.Species ?? payload.species,
      breed: data.breed ?? data.Breed ?? payload.breed,
      age: data.age ?? data.Age ?? payload.age,
      notes: data.notes ?? data.Notes ?? payload.notes,
      clientId: data.clientId ?? data.ClientId ?? payload.clientId ?? 0,
      planId: data.planId ?? data.PlanId ?? payload.planId,
    };
  },
};
