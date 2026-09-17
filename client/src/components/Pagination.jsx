import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span>Previous</span>
      </button>
      <div className="rounded-xl border border-slate-200/70 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs">
        <span>Page {page} of {totalPages}</span>
      </div>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition"
      >
        <span>Next</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

