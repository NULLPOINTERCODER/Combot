import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationDrawer from "./NotificationDrawer.jsx";
import { useUnreadCount } from "../hooks/useUnreadCount.js";

export default function BellButton() {
  const { unreadCount } = useUnreadCount();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        aria-label="What's New Notifications"
        title="What's New updates"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse-subtle">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      <NotificationDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

