import { useState } from "react";
import { authService } from "../services/authService";
import type { UserDTO } from "../interfaces/User";

interface UseAuth {
  loading: boolean;
  error: string | null;
  login: (user: UserDTO) => Promise<boolean>;
  register: (user: UserDTO) => Promise<boolean>;
}

export const useAuth = (): UseAuth => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (user: UserDTO): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(user);
      // You can save the user data to local storage or context here
      console.log(response);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (user: UserDTO): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(user);
      // You can save the user data to local storage or context here
      console.log(response);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao registrar!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login, register };
};
