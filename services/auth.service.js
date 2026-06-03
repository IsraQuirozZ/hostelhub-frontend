import * as SecureStore from "expo-secure-store";
import api from "./api";

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    const token = data.data?.token;
    if (!token) throw new Error("No se recibió token del servidor");
    await SecureStore.setItemAsync("token", token);
    return data;
  },

  async register(nombre, email, password, nacionalidad) {
    const { data } = await api.post("/auth/register", {
      nombre,
      email,
      password,
      ...(nacionalidad && { nacionalidad }),
    });
    const token = data.data?.token;
    if (!token) throw new Error("No se recibió token del servidor");
    await SecureStore.setItemAsync("token", token);
    return data;
  },

  async logout() {
    await SecureStore.deleteItemAsync("token");
  },

  async getToken() {
    return SecureStore.getItemAsync("token");
  },
};
