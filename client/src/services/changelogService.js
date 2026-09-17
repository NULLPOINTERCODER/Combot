import { api } from "./api.js";

export const changelogService = {
  list: (params) => api.get("/changelog", { params }),
  search: (q, params) => api.get("/changelog/search", { params: { q, ...params } }),
  getBySlug: (slug) => api.get(`/changelog/${slug}`),
  react: (id, type) => api.post(`/changelog/${id}/reactions`, { type }),
  unreact: (id, type) => api.delete(`/changelog/${id}/reactions/${type}`),

  // admin
  adminList: (params) => api.get("/admin/changelogs", { params }),
  adminGet: (id) => api.get(`/admin/changelogs/${id}`),
  adminCreate: (payload) => api.post("/admin/changelogs", payload),
  adminUpdate: (id, payload) => api.put(`/admin/changelogs/${id}`, payload),
  adminDelete: (id) => api.delete(`/admin/changelogs/${id}`),
  adminPublish: (id) => api.patch(`/admin/changelogs/${id}/publish`),
  adminUnpublish: (id) => api.patch(`/admin/changelogs/${id}/unpublish`),
};
