import api from "./api";

export const rutaService = {
  async getRuta(id_reserva) {
    const { data } = await api.get(`/routes/${id_reserva}`);
    return data.data;
  },
};
