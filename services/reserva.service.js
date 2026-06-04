import api from "./api";

export const reservaService = {
  async createReserva({
    id_habitacion,
    fecha_inicio,
    fecha_fin,
    num_personas,
  }) {
    const { data } = await api.post("/reservations", {
      id_habitacion,
      fecha_inicio,
      fecha_fin,
      num_personas,
    });
    return data.data;
  },

  async getMyReservas() {
    const { data } = await api.get("/reservations/me");
    return data.data;
  },

  async confirmarReserva(id_reserva) {
    const { data } = await api.post(`/reservations/${id_reserva}/confirmar`);
    return data.data;
  },
};
