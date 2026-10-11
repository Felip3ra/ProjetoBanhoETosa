import { useState } from "react";
import { authService } from "../services/authService";
import type { User, UserDTO } from "../interfaces/User";

interface UseAuth {
  loading: boolean;
  error: string | null;
  user: User | null;
  login: (user: UserDTO) => Promise<boolean>;
  register: (user: UserDTO) => Promise<boolean>;
}

export const useAuth = (): UseAuth => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (user: UserDTO): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(user);
      if (response?.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
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
      if (response?.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao registrar!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, user, login, register };
};
