import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading updates..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      <span className="text-xs font-semibold text-slate-500">{label}</span>
    </div>
  );
}

