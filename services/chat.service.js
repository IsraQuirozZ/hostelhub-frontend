import api from "./api";

export const chatService = {
  async getMyChats() {
    const { data } = await api.get("/chats/me");
    return data.data;
  },

  async getMessages(id_chat) {
    const { data } = await api.get(`/chats/${id_chat}/messages`);
    return data.data;
  },

  async sendMessage(id_chat, contenido) {
    const { data } = await api.post(`/chats/${id_chat}/messages`, {
      contenido,
    });
    return data.data;
  },
};
