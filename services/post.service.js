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

  async createPost(postData) {
    const { data } = await api.post("/posts", postData);
    return data;
  },

  async deletePost(id_post) {
    const { data } = await api.delete(`/posts/${id_post}`);
    return data.data;
  },
};
