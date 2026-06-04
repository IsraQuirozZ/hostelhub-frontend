import api from "./api";

export const hostelService = {
  async getCities() {
    const { data } = await api.get("/hostals/cities");
    return data.data;
  },

  async getHostels(search = "") {
    const url = search ? `/hostals?city=${search}` : "/hostals";
    const { data } = await api.get(url);
    return data.data;
  },

  async getHostelsByCity(cityName) {
    const { data } = await api.get(`/hostals?city=${cityName}`);
    return data.data;
  },

  async getTopHostels() {
    const { data } = await api.get("/hostals/top");
    return data.data;
  },

  async getHostelById(id) {
    const { data } = await api.get(`/hostals/${id}`);
    return data.data;
  },
};
