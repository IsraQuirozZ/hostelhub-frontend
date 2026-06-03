import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const { data } = await api.get("/users/me");
          setUser(data);
        }
      } catch {
        await SecureStore.deleteItemAsync("token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    await authService.login(email, password);
    const { data } = await api.get("/users/me");
    setUser(data);
  };

  const register = async (nombre, email, password, nacionalidad) => {
    await authService.register(nombre, email, password, nacionalidad);
    const { data } = await api.get("/users/me");
    setUser(data);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
