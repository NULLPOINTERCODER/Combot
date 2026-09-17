import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "Something went wrong loading updates.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200/80 bg-red-50/50 p-10 text-center shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-3 border border-red-200">
        <AlertCircle className="h-6 w-6" />
      </div>
      <p className="text-sm font-bold text-red-900">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try again</span>
        </button>
      )}
    </div>
  );
}

