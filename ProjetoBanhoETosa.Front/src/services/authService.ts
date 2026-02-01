import type { UserDTO } from "../interfaces/User";

// Backend UsersController está exposto em /api/Users
const API_BASE_URL = "/api/Users";

export const authService = {
  login: async (user: UserDTO): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/Autentication`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao fazer login");
    }
    return response.json();
  },

  register: async (user: UserDTO): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/Register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro ao registrar");
    }
    return response.json();
  },
};
