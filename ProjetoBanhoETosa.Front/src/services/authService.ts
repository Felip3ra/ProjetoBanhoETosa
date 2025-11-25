import type { UserDTO } from "../interfaces/User";

const API_BASE_URL = "http://localhost:5159";

export const authService = {
  login: async (user: UserDTO): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/Autentication`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
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
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
  },
};
