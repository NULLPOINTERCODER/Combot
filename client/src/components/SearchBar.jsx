import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search releases & updates..." }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200/80 bg-white py-2 pl-9 pr-8 text-xs sm:text-sm font-medium placeholder:text-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition"
      />
      {value ? (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline-block">
          /
        </kbd>
      )}
    </div>
  );
}

