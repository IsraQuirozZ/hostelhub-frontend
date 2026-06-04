import api from "./api";

export const userService = {
  async getMyLanguages() {
    const { data } = await api.get("/users/me/languages");
    return data.data;
  },

  async getAllLanguages() {
    const { data } = await api.get("/users/languages");
    return data.data;
  },

  async addLanguage(codigo_iso, nivel) {
    const { data } = await api.post("/users/me/languages", {
      codigo_iso,
      nivel,
    });
    return data.data;
  },

  async removeLanguage(codigo_iso) {
    const { data } = await api.delete(`/users/me/languages/${codigo_iso}`);
    return data.data;
  },
};
