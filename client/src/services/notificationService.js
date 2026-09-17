import { api } from "./api.js";

export const notificationService = {
  list: () => api.get("/notifications"),
  unreadCount: () => api.get("/notifications/unread-count"),
  markRead: () => api.post("/notifications/mark-read"),
};
