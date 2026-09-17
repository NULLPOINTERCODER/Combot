import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { notificationService } from "../services/notificationService.js";
import { useAuthContext } from "./AuthContext.jsx";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return setUnreadCount(0);
    try {
      const res = await notificationService.unreadCount();
      setUnreadCount(res.data.unreadCount);
    } catch {
      // silently ignore - notification bell is non-critical
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async () => {
    if (!isAuthenticated) return;
    const res = await notificationService.markRead();
    setUnreadCount(res.data.unreadCount);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used within NotificationProvider");
  return ctx;
}
