import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = "Confirm" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onCancel} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200/60">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        {description && <p className="text-xs text-slate-500 leading-relaxed pl-13 mb-5">{description}</p>}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

