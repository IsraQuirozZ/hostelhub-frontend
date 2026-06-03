import api from "./api";

export const hostelService = {
  async getCities() {
    const { data } = await api.get("/hostels/cities");
    return data.data;
  },

  async getHostels(search = "") {
    const url = search ? `/hostels?search=${search}` : "/hostels";
    const { data } = await api.get(url);
    return data.data;
  },

  async getTopHostels() {
    const { data } = await api.get("/hostels/top");
    return data.data;
  },
};
