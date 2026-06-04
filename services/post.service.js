import api from "./api";

export const postService = {
  async getPosts() {
    const { data } = await api.get("/posts");
    return data;
  },

  async getPostsByCityId(id_ciudad) {
    const { data } = await api.get(`/posts/city/${id_ciudad}`);
    return data.data;
  },

  async getMyPosts() {
    const { data } = await api.get("/posts/me");
    return data.data;
  },

  async getPostById(id) {
    const { data } = await api.get(`/posts/${id}`);
    return data.data;
  },
  async createPost({ titulo, contenido, id_ciudad, nombre_lugar }) {
    const { data } = await api.post("/posts", {
      titulo,
      contenido,
      id_ciudad,
      ...(nombre_lugar && { nombre_lugar }),
    });
    return data;
  },
};
