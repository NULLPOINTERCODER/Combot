import { api } from "./api.js";

export const authService = {
  signup: (payload) => api.post("/auth/signup", payload),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }),
  me: () => api.get("/auth/me"),
};
