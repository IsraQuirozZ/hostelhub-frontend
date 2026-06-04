import api from "./api";

export const hostelService = {
  async getCities() {
    const { data } = await api.get("/hostels/cities");
    return data.data;
  },

  async getHostels(search = "") {
    const url = search ? `/hostels?city=${search}` : "/hostels";
    const { data } = await api.get(url);
    return data.data;
  },

  async getHostelsByCity(cityName) {
    const { data } = await api.get(`/hostels?city=${cityName}`);
    return data.data;
  },

  async getTopHostels() {
    const { data } = await api.get("/hostels/top");
    return data.data;
  },

  async getHostelById(id) {
    const { data } = await api.get(`/hostels/${id}`);
    return data.data;
  },
};
