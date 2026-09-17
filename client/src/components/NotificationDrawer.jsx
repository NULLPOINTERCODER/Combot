import { useEffect, useState } from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import NotificationItem from "./NotificationItem.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import EmptyState from "./EmptyState.jsx";
import { notificationService } from "../services/notificationService.js";
import { useUnreadCount } from "../hooks/useUnreadCount.js";

export default function NotificationDrawer({ open, onClose }) {
  const { markAsRead } = useUnreadCount();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    notificationService
      .list()
      .then((res) => setItems(res.data.data))
      .finally(() => setLoading(false));
    markAsRead();
  }, [open, markAsRead]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl sm:w-[26rem] border-l border-slate-200/80 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 border border-brand-200/50">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">What's New</h2>
              <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Marked all as read
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {loading ? (
            <div className="py-12"><LoadingSpinner /></div>
          ) : items.length === 0 ? (
            <EmptyState title="No updates yet" message="Check back later for exciting product releases." />
          ) : (
            <div className="flex flex-col gap-2.5">
              {items.map((item) => (
                <NotificationItem key={item.id} item={item} onClick={onClose} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/80 px-4 py-3 bg-white text-center">
          <a
            href="/"
            onClick={onClose}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            View all releases in timeline →
          </a>
        </div>
      </div>
    </div>
  );
}

