import api from "./api";

export const reviewService = {
  async createReview(id_hostal, { puntuacion, contenido }) {
    const { data } = await api.post(`/hostels/${id_hostal}/reviews`, {
      puntuacion,
      contenido,
    });
    return data.data;
  },
};
